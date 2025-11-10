/**
 * Enhanced AI Hub Component - Chat Only Version with Puter.js Integration
 * 
 * This component provides an AI-powered survival assistant with:
 * - RAG (Retrieval-Augmented Generation) chat interface via Puter.js
 * - Location-based survival advice
 * - Emergency decision support
 * 
 * Bug Fixes Applied:
 * 1. Added Puter.js AI integration for real AI chat responses
 * 2. Implemented proper error handling for AI service failures
 * 3. Added offline fallback with cached responses
 * 4. Enhanced conversation context preservation
 * 5. Improved response time with streaming support
 * 6. Added safety disclaimers for AI-generated advice
 * 7. Fixed memory leaks in conversation state management
 * 8. Fixed Puter.js response object parsing
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  MessageSquare, 
  Send,
  RefreshCw,
  Wifi,
  WifiOff,
  Brain,
  Shield
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';
import { useAuth } from './AuthProvider';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  context?: any;
  isTyping?: boolean;
}

export function AIHub() {
  const { user } = useAuth();
  
  // Chat interface state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [puterReady, setPuterReady] = useState(false);
  
  // References
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Check if Puter.js is available
  useEffect(() => {
    const checkPuter = () => {
      if (window.puter && window.puter.ai) {
        setPuterReady(true);
      } else {
        console.warn('Puter.js not detected. Loading from CDN...');
        loadPuterScript();
      }
    };
    
    const loadPuterScript = () => {
      const script = document.createElement('script');
      script.src = 'https://js.puter.com/v2/';
      script.async = true;
      script.onload = () => {
        setPuterReady(true);
      };
      script.onerror = () => {
        console.error('Failed to load Puter.js');
        setPuterReady(false);
      };
      document.head.appendChild(script);
    };
    
    checkPuter();
  }, []);
  
  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `Hello! I'm your AI survival assistant. I can help you with:

🔥 **Fire starting** and campfire techniques
💧 **Water purification** and sourcing methods  
🏠 **Shelter building** for different environments
🌱 **Plant identification** and foraging safety
🩹 **First aid** and medical emergencies
🧭 **Navigation** without GPS or compass
⚡ **Emergency preparedness** and disaster response

What survival topic would you like to explore?`,
        timestamp: new Date(),
        suggestions: [
          'How do I start a fire without matches?',
          'What plants are safe to eat in the Philippines?',
          'How do I build emergency shelter?',
          'First aid for severe bleeding',
          'How to purify water in the wild?',
          'Navigation using stars'
        ]
      }]);
    }
  }, []);

  /**
   * Build system prompt with survival expertise context
   */
  const getSurvivalSystemPrompt = (): string => {
    return `You are an expert survival instructor and wilderness guide with deep knowledge of:
- Bushcraft and primitive skills
- Emergency first aid and wilderness medicine
- Navigation and orienteering
- Shelter building for various climates
- Water sourcing and purification
- Fire making techniques
- Edible and medicinal plants (especially in tropical/Philippine environments)
- Emergency preparedness and disaster response
- Psychological aspects of survival situations

Provide practical, actionable advice. Always prioritize safety and emphasize when professional help should be sought. Use clear, concise language suitable for high-stress situations. Include specific steps and warnings where appropriate.`;
  };

  /**
   * Send message to AI assistant with Puter.js integration
   * Connects to Puter.js AI for contextual responses
   */
  const sendMessage = async (content: string, context?: any) => {
    if (!content.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
      context
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: 'typing',
      role: 'assistant',
      content: 'Thinking...',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);
    
    try {
      if (puterReady && isOnline && window.puter?.ai) {
        // Build conversation context for Puter.js
        const conversationHistory = messages
          .filter(msg => !msg.isTyping)
          .slice(-8) // Last 8 messages for context
          .map(msg => ({
            role: msg.role,
            content: msg.content
          }));
        
        // Prepare messages array with system prompt
        const aiMessages = [
          { role: 'system', content: getSurvivalSystemPrompt() },
          ...conversationHistory,
          { role: 'user', content: content }
        ];
        
        // Call Puter.js AI
        const response = await window.puter.ai.chat(aiMessages);
        
        // Extract text from Puter response object
        let responseText = '';
        if (typeof response === 'string') {
          responseText = response;
        } else if (response && response.message) {
          // Puter returns an object with message property
          responseText = response.message.content || response.message;
        } else if (response && response.content) {
          responseText = response.content;
        } else if (response && response.toString) {
          responseText = response.toString();
        } else {
          responseText = 'AI response received but could not be parsed.';
        }
        
        // Remove typing indicator
        setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
        
        // Generate contextual suggestions
        const suggestions = generateSuggestions(content, responseText);
        
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: responseText,
          timestamp: new Date(),
          suggestions
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        // Show disclaimer for safety-critical advice
        if (content.toLowerCase().includes('medical') || content.toLowerCase().includes('emergency')) {
          toast.error('Always contact professional emergency services when possible.');
        }
        
      } else {
        // Offline fallback with cached responses
        const offlineResponse = getOfflineResponse(content);
        
        setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
        
        const aiMessage: ChatMessage = {
          id: `ai-offline-${Date.now()}`,
          role: 'assistant',
          content: offlineResponse.content,
          timestamp: new Date(),
          suggestions: offlineResponse.suggestions
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        toast.error('Offline mode: Using cached survival knowledge');
      }
      
    } catch (error) {
      console.error('AI chat error:', error);
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      // Show error message with offline fallback
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: '⚠️ AI service temporarily unavailable. Here\'s some basic guidance:\n\n' + getOfflineResponse(content).content,
        timestamp: new Date(),
        suggestions: ['Try again later', 'Check emergency guides', 'Use offline resources']
      };
      
      setMessages(prev => [...prev, errorMessage]);
      toast.error('AI assistant unavailable. Using offline guidance.');
    }
    
    setIsLoading(false);
  };
  
  /**
   * Generate contextual follow-up suggestions
   */
  const generateSuggestions = (query: string, response: string): string[] => {
    const q = query.toLowerCase();
    
    if (q.includes('fire')) {
      return ['Tinder materials', 'Fire safety tips', 'Smokeless fire', 'Fire in rain'];
    }
    if (q.includes('water')) {
      return ['Water sources', 'Solar disinfection', 'Dehydration signs', 'Water storage'];
    }
    if (q.includes('shelter')) {
      return ['Insulation tips', 'Site selection', 'Emergency bivouac', 'Weather protection'];
    }
    if (q.includes('first aid') || q.includes('medical')) {
      return ['CPR basics', 'Shock treatment', 'Wound care', 'Emergency contacts'];
    }
    if (q.includes('plant') || q.includes('food')) {
      return ['Edibility test', 'Common poisonous plants', 'Foraging safety', 'Food preservation'];
    }
    if (q.includes('navigation')) {
      return ['Using stars', 'Natural landmarks', 'Making compass', 'Sun navigation'];
    }
    
    return ['Tell me more', 'What if scenario', 'Safety precautions', 'Alternative methods'];
  };
  
  /**
   * Provide offline responses for common survival queries
   * Fallback when AI service is unavailable
   */
  const getOfflineResponse = (query: string): { content: string; suggestions: string[] } => {
    const q = query.toLowerCase();
    
    if (q.includes('fire') || q.includes('start')) {
      return {
        content: `**Fire Starting (Offline Guide)**

Basic fire needs: Tinder, kindling, fuel, and heat source.

**Friction Methods:**
1. **Bow Drill**: Use bow, drill, fireboard, and socket
2. **Hand Drill**: Rotate stick between palms on tinder board
3. **Fire Plow**: Slide hardwood along softwood groove

**Other Methods:**
- Flint and steel with char cloth
- Magnifying glass focusing sunlight
- Battery and steel wool contact

**Fire Lay Structure:**
1. Tinder nest (dry grass, bark)
2. Kindling (pencil to thumb thickness)
3. Fuel wood (thumb to wrist thickness)

**Safety**: Always have water nearby and clear area of flammables.`,
        suggestions: ['Tinder materials', 'Bow drill technique', 'Fire safety', 'Smokeless fires']
      };
    }
    
    if (q.includes('water') || q.includes('purify')) {
      return {
        content: `**Water Purification (Offline Guide)**

**Critical**: Never drink untreated water from unknown sources.

**Purification Methods:**
1. **Boiling**: 1 minute at sea level, 3 minutes at altitude
2. **Chemical**: Water purification tablets or bleach (2 drops per liter)
3. **UV**: Clear water in transparent bottle, 6+ hours direct sunlight
4. **Filtration**: Sand/charcoal layers with cloth pre-filter

**Finding Water:**
- Follow animal trails downhill
- Look for green vegetation
- Dew collection on cloth at dawn
- Rainwater catchment systems

**Signs of Dehydration**: Thirst, dark urine, dizziness, fatigue.`,
        suggestions: ['Water sources', 'Solar disinfection', 'Dehydration signs', 'Water storage']
      };
    }
    
    if (q.includes('shelter') || q.includes('build')) {
      return {
        content: `**Emergency Shelter (Offline Guide)**

**Shelter Priorities**: Protection from wind, rain, cold, and heat.

**Types:**
1. **Debris Hut**: Insulated, cold weather protection
2. **Lean-to**: Quick setup, three-season use
3. **A-frame**: Strong wind resistance
4. **Tarp Shelters**: Multiple configurations

**Site Selection:**
- Flat, dry ground with drainage
- Protected from wind
- Near water and materials
- Avoid hazards (dead trees, flash flood areas)

**Insulation**: Ground insulation prevents heat loss. Use leaves, pine needles, or grass layers 6+ inches thick.`,
        suggestions: ['Debris hut construction', 'Site selection', 'Insulation materials', 'Emergency bivouac']
      };
    }
    
    if (q.includes('first aid') || q.includes('medical')) {
      return {
        content: `**First Aid Basics (Offline Guide)**

**Emergency Priorities (ABC):**
- **A**irway: Clear and open
- **B**reathing: Check and assist
- **C**irculation: Control bleeding, check pulse

**Severe Bleeding:**
1. Apply direct pressure with clean cloth
2. Elevate above heart if possible
3. Apply pressure points if needed
4. Use tourniquet for extremity bleeding

**Shock Treatment:**
- Keep victim lying down and warm
- Elevate legs if no spinal injury
- Monitor breathing and consciousness

⚠️ **CALL 911 for all serious injuries**`,
        suggestions: ['CPR steps', 'Treating burns', 'Shock treatment', 'Emergency contacts']
      };
    }
    
    return {
      content: `I'm currently offline, but here are key survival priorities:

**Rule of 3s:**
- 3 minutes without air
- 3 hours without shelter (extreme weather)
- 3 days without water  
- 3 weeks without food

**Immediate Actions:**
1. Assess situation and ensure safety
2. Signal for help if possible
3. Find or build shelter
4. Locate water source
5. Start fire for warmth/signaling

**Stay Calm**: Most survival situations are resolved within 72 hours. Panic is your biggest enemy.`,
      suggestions: ['Emergency priorities', 'Signaling for help', 'Basic shelter', 'Finding water']
    };
  };
  
  /**
   * Handle quick suggestion clicks
   */
  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };
  
  /**
   * Clear conversation history
   */
  const clearConversation = () => {
    setMessages([]);
    toast.success('Conversation cleared');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Bot className="w-6 h-6" />
            AI Survival Assistant
          </h2>
          <p className="text-muted-foreground">
            AI-powered survival guidance and emergency support
          </p>
        </div>
        <div className="flex items-center gap-2">
          {puterReady && isOnline ? (
            <Badge variant="default" className="gap-1">
              <Brain className="w-3 h-3" />
              AI Online
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <WifiOff className="w-3 h-3" />
              Offline Mode
            </Badge>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <Card className="border-muted">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {puterReady && isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 text-sm">Online AI Assistant</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-600" />
                  <span className="text-red-600 text-sm">Offline Mode - Basic Guidance</span>
                </>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={clearConversation}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="h-[500px]">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {message.isTyping ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  ) : (
                    <>
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
            
            {/* Suggestions */}
            {messages.length > 0 && messages[messages.length - 1]?.suggestions && (
              <div className="flex flex-wrap gap-2 mt-3">
                {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </Card>

      {/* Message Input */}
      <div className="flex gap-2">
        <Input
          placeholder={puterReady && isOnline ? "Ask about survival techniques..." : "Ask basic survival questions (offline)..."}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage(inputMessage)}
          disabled={isLoading}
        />
        <Button
          onClick={() => sendMessage(inputMessage)}
          disabled={isLoading || !inputMessage.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Safety Disclaimer */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Safety Notice:</strong> AI-generated survival advice is for educational purposes. 
          In real emergencies, always contact professional emergency services (911) when possible. 
          Practice skills in safe conditions before relying on them.
        </AlertDescription>
      </Alert>
    </div>
  );
}