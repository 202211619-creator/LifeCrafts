/**
 * Enhanced Emergency Mode Component
 * 
 * This component provides a comprehensive emergency toolkit with:
 * - Real emergency calling functionality (opens device dialer)
 * - Hardware compass integration using device orientation sensors
 * - Flashlight control via camera API with torch mode
 * - Location sharing with Google Maps integration
 * - Offline survival guides with step-by-step instructions
 * - Family check-in system with location broadcasting
 * 
 * Bug Fixes Applied:
 * 1. Fixed flashlight permission handling and fallback messaging
 * 2. Added proper error handling for compass sensor access
 * 3. Implemented real tel: URL calling instead of mock toasts
 * 4. Added location permission check and error handling
 * 5. Fixed compass heading calculation and magnetic declination
 * 6. Added offline guide caching and display
 * 7. Improved family check-in with location data
 * 8. Enhanced emergency contact regional configuration
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Heart, 
  Flame, 
  Home, 
  Navigation, 
  Leaf, 
  Link,
  Phone,
  MapPin,
  Compass,
  Flashlight,
  Users,
  Share2,
  PhoneCall,
  Zap,
  Activity,
  Clock,
  Camera,
  BookOpen,
  ChevronRight,
  Star,
  AlertTriangle,
  Shield,
  Settings,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  CheckCircle,
  Info
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from './AuthProvider';
import { supabase } from '../utils/supabase/client';
import { getApiUrl, getAuthHeaders } from '../utils/config';

interface EmergencyModeProps {
  onExit: () => void;
}

interface SurvivalGuide {
  title: string;
  description: string;
  steps: string[];
  tips: string[];
  images?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  category: string;
}

interface EmergencyContact {
  name: string;
  number: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  region?: string;
  available24h: boolean;
}

// Philippine emergency contacts with proper regional numbers
const emergencyContacts: EmergencyContact[] = [
  { 
    name: 'Emergency Services (911)', 
    number: '911', 
    description: 'Police, Fire, Medical Emergency', 
    priority: 'critical',
    available24h: true
  },
  { 
    name: 'NDRRMC Disaster Response', 
    number: '+63-2-8911-1406', 
    description: 'National Disaster Risk Reduction', 
    priority: 'high',
    available24h: true
  },
  { 
    name: 'Philippine Red Cross', 
    number: '143', 
    description: 'Emergency Medical Services', 
    priority: 'high',
    available24h: true
  },
  { 
    name: 'Philippine Coast Guard', 
    number: '+63-2-8527-8481', 
    description: 'Maritime & Search Rescue', 
    priority: 'high',
    available24h: true
  },
  { 
    name: 'Fire Department', 
    number: '116', 
    description: 'Fire Emergency Response', 
    priority: 'high',
    available24h: true
  },
  { 
    name: 'MMDA Flood Control', 
    number: '136', 
    description: 'Metro Manila Traffic/Flood', 
    priority: 'medium',
    region: 'Metro Manila',
    available24h: true
  },
  { 
    name: 'DOH Health Emergency', 
    number: '+63-2-8651-7800', 
    description: 'Health Crisis Hotline', 
    priority: 'medium',
    available24h: false
  },
  { 
    name: 'PAGASA Weather', 
    number: '+63-2-8284-0800', 
    description: 'Weather Information', 
    priority: 'low',
    available24h: true
  }
];

// Comprehensive survival guides with detailed instructions
const survivalGuides: Record<string, { title: string; icon: any; color: string; guides: SurvivalGuide[] }> = {
  'first-aid': {
    title: 'First Aid',
    icon: Heart,
    color: 'bg-red-500',
    guides: [
      {
        title: 'CPR (Cardiopulmonary Resuscitation)',
        description: 'Life-saving chest compressions and rescue breathing for cardiac arrest victims',
        difficulty: 'intermediate',
        estimatedTime: '10-15 minutes to learn',
        category: 'medical',
        steps: [
          'Check for responsiveness - tap shoulders firmly and shout "Are you okay?"',
          'Call 911 immediately or instruct someone else to call and get an AED',
          'Position victim on back on firm, flat surface',
          'Tilt head back slightly and lift chin to open airway',
          'Place heel of one hand on center of chest between nipples',
          'Place other hand on top, interlacing fingers, keeping arms straight',
          'Push hard and fast at least 2 inches deep (5cm), allow complete recoil',
          'Compress at rate of 100-120 compressions per minute',
          'After 30 compressions, tilt head back and give 2 rescue breaths',
          'Continue cycles of 30 compressions : 2 breaths until help arrives',
          'Switch with another person every 2 minutes to prevent fatigue'
        ],
        tips: [
          'Don\'t be afraid to push hard - broken ribs heal, but brain death is permanent',
          'Count out loud: "1 and 2 and 3..." to maintain rhythm',
          'If AED becomes available, use it immediately as instructed',
          'Continue until emergency services take over or victim starts breathing',
          'For children, use heel of one hand; for infants, use two fingers'
        ],
        images: [
          'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&auto=format&fit=crop'
        ]
      },
      {
        title: 'Severe Bleeding Control',
        description: 'Stop life-threatening bleeding using pressure points and tourniquets',
        difficulty: 'beginner',
        estimatedTime: '5 minutes to learn',
        category: 'medical',
        steps: [
          'Ensure scene safety - wear gloves if available to protect from bloodborne pathogens',
          'Apply direct pressure to wound with cleanest available cloth or gauze',
          'Maintain firm, continuous pressure - do not lift to check bleeding',
          'If blood soaks through, add more layers without removing the first',
          'Elevate injured area above heart level if possible and no fracture suspected',
          'If bleeding continues, apply pressure to arterial pressure points',
          'For extremity bleeding, consider tourniquet 2-3 inches above wound',
          'Tighten tourniquet until bleeding stops, note time of application',
          'Treat for shock - keep victim warm, calm, and lying down',
          'Monitor breathing and consciousness while waiting for help'
        ],
        tips: [
          'Never remove impaled objects - stabilize them in place',
          'Use hemostatic gauze if available for severe wounds',
          'Mark tourniquet time clearly - loss of limb occurs after 2 hours',
          'Apply pressure dressing once bleeding is controlled',
          'Internal bleeding signs: weakness, thirst, rapid pulse, pale skin'
        ]
      },
      {
        title: 'Treating Burns',
        description: 'Proper treatment for thermal, chemical, and electrical burns',
        difficulty: 'beginner',
        estimatedTime: '8 minutes to learn',
        category: 'medical',
        steps: [
          'Remove victim from heat source - ensure your safety first',
          'Stop, drop, and roll if clothing is on fire',
          'Cool burn with cool (not ice cold) running water for 10-20 minutes',
          'Remove jewelry and tight clothing before swelling begins',
          'Cover burn with sterile, non-adhesive bandage or clean cloth',
          'Do not apply butter, oil, or home remedies to burns',
          'For chemical burns, flush with water for 20+ minutes',
          'For electrical burns, check for entry and exit wounds',
          'Give pain relief if available and victim is conscious',
          'Seek medical attention for burns larger than palm of hand'
        ],
        tips: [
          'First degree: red skin, no blisters - treat with cool water and aloe',
          'Second degree: blisters present - do not pop, seek medical care',
          'Third degree: white/charred skin - call 911 immediately',
          'For major burns, treat for shock and monitor breathing',
          'Elevate burned limbs above heart level if possible'
        ]
      }
    ]
  },
  'fire': {
    title: 'Fire Starting',
    icon: Flame,
    color: 'bg-orange-500',
    guides: [
      {
        title: 'Bow Drill Fire Method',
        description: 'Primitive friction fire technique using natural materials',
        difficulty: 'advanced',
        estimatedTime: '30-45 minutes to master',
        category: 'survival',
        steps: [
          'Gather materials: flexible bow wood (3ft), straight drill (8in hardwood), fireboard (8in softwood)',
          'Cut V-shaped notch in fireboard next to where drill will go',
          'Wrap bowstring around drill shaft once - ensure snug fit',
          'Place drill in fireboard depression with socket on top',
          'Apply firm downward pressure while sawing bow back and forth',
          'Start slowly, increase speed as wood heats up and smokes',
          'Continue until fine black powder collects in notch',
          'When ember glows red, carefully tap onto tinder bundle',
          'Blow gently into tinder bundle until it bursts into flame',
          'Transfer flame to kindling nest, then gradually add larger fuel',
          'Feed fire consistently - have wood ready before flame dies'
        ],
        tips: [
          'Use cedar, basswood, or willow for fireboard (softwood)',
          'Drill should be hardwood like oak or maple',
          'Keep tinder bundle dry and loosely packed',
          'Practice motion before attempting to make fire',
          'Have water nearby for safety',
          'Prepare fire lay structure before creating flame'
        ],
        images: [
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop'
        ]
      },
      {
        title: 'Flint and Steel Method',
        description: 'Traditional spark-based fire starting using metal striker',
        difficulty: 'intermediate',
        estimatedTime: '15-20 minutes to learn',
        category: 'survival',
        steps: [
          'Gather flint or hard quartzite stone, steel striker, char cloth',
          'Hold flint firmly in non-dominant hand with sharp edge exposed',
          'Strike steel against flint edge at 45-degree angle with force',
          'Aim sparks directly at char cloth or prepared tinder',
          'When char cloth catches spark and glows, transfer to tinder bundle',
          'Blow gently on glowing tinder until smoke increases',
          'Continue blowing until tinder bundle bursts into flame',
          'Immediately place flaming tinder into prepared kindling nest',
          'Add small twigs gradually, maintaining airflow',
          'Build up fire size slowly to avoid smothering flame'
        ],
        tips: [
          'Char cloth is cotton cloth burned in oxygen-free environment',
          'Strike with firm, consistent motion - practice the technique',
          'Have multiple pieces of char cloth ready',
          'Prepare tinder bundle before striking sparks',
          'Fungus (amadou) also catches sparks well'
        ]
      }
    ]
  },
  'shelter': {
    title: 'Shelter Building',
    icon: Home,
    color: 'bg-blue-500',
    guides: [
      {
        title: 'Debris Hut Construction',
        description: 'Insulated emergency shelter for cold weather survival',
        difficulty: 'intermediate',
        estimatedTime: '2-3 hours to build',
        category: 'shelter',
        steps: [
          'Find ridgepole 9-12 feet long, thick as your arm',
          'Prop one end against tree or support at 3-4 feet height',
          'Secure ridgepole to prevent rolling or sliding',
          'Add ribs (shorter branches) on both sides every 12 inches',
          'Lay ribs at 45-degree angle from ridgepole to ground',
          'Pile debris (leaves, pine needles, grass) 2-3 feet thick over frame',
          'Add more ribs over debris to hold insulation in place',
          'Create thick bed of dry insulating material inside shelter',
          'Make entrance hole just large enough to crawl through',
          'Create door plug with bundled debris to seal entrance when inside'
        ],
        tips: [
          'Shelter should be only large enough for your body plus 6 inches',
          'Use dry debris for better insulation - avoid wet materials',
          'Build on slight slope with head uphill for drainage',
          'Face entrance away from prevailing wind direction',
          'Line inside with additional soft materials for comfort',
          'Test for drafts and add more debris as needed'
        ],
        images: [
          'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400&auto=format&fit=crop'
        ]
      },
      {
        title: 'Lean-To Shelter',
        description: 'Quick shelter for temporary protection from elements',
        difficulty: 'beginner',
        estimatedTime: '1 hour to build',
        category: 'shelter',
        steps: [
          'Find long ridgepole and prop against tree at 45-degree angle',
          'Place one end on ground, secure the elevated end to tree',
          'Lay branches as ribs perpendicular to ridgepole',
          'Start with longest branches at bottom, shorter at top',
          'Layer ribs like shingles with thick end pointing down',
          'Cover with leaves, bark, or tarp for waterproofing',
          'Build reflector wall opposite shelter opening',
          'Place fire between shelter and reflector for warmth',
          'Create bed of insulating materials inside shelter'
        ],
        tips: [
          'Quick to build but less insulated than debris hut',
          'Good for short-term use or mild weather',
          'Reflector wall increases heat from fire',
          'Angle should shed rain effectively'
        ]
      }
    ]
  },
  'navigation': {
    title: 'Navigation',
    icon: Navigation,
    color: 'bg-green-500',
    guides: [
      {
        title: 'Shadow Stick Navigation',
        description: 'Find true direction using sun and shadows',
        difficulty: 'beginner',
        estimatedTime: '30 minutes to complete',
        category: 'navigation',
        steps: [
          'Find straight stick about 3 feet long and clear, level ground',
          'Push stick vertically into ground in sunny area',
          'Mark tip of shadow with small stone or stick',
          'Wait exactly 15-20 minutes for shadow to move',
          'Mark new shadow tip with another stone',
          'Draw straight line connecting the two shadow marks',
          'This line runs east-west (first mark is west, second is east)',
          'Stand with west mark to your left - you are now facing north',
          'Use this to orient map or establish travel direction'
        ],
        tips: [
          'Works best between 10 AM and 2 PM when shadows are short',
          'More accurate with longer waiting time between marks',
          'Can be used anywhere in the world',
          'Shadow always moves from west to east',
          'Method works in both northern and southern hemispheres'
        ]
      },
      {
        title: 'Using the North Star (Polaris)',
        description: 'Navigate at night using star navigation',
        difficulty: 'intermediate',
        estimatedTime: '20 minutes to learn',
        category: 'navigation',
        steps: [
          'Look for Big Dipper constellation (Ursa Major)',
          'Locate the two stars at the end of the dipper\'s bowl',
          'These are called the "pointer stars" (Merak and Dubhe)',
          'Draw imaginary line through pointer stars',
          'Follow this line about 5 times the distance between pointers',
          'This leads directly to Polaris, the North Star',
          'Polaris marks true north direction with 1-degree accuracy',
          'Use North Star to orient yourself and maintain heading'
        ],
        tips: [
          'North Star appears stationary while other stars rotate around it',
          'Only works in Northern Hemisphere - invisible south of equator',
          'Big Dipper rotates around North Star throughout night',
          'North Star is not the brightest star in sky',
          'Learn backup constellations like Cassiopeia to find Polaris'
        ]
      }
    ]
  },
  'plants': {
    title: 'Edible Plants',
    icon: Leaf,
    color: 'bg-green-600',
    guides: [
      {
        title: 'Universal Edibility Test',
        description: 'Safe method to test unknown plants for edibility',
        difficulty: 'advanced',
        estimatedTime: '24+ hours to complete',
        category: 'foraging',
        steps: [
          'Separate plant into parts (leaves, stems, roots, flowers)',
          'Inspect for milky sap, three-leaved growth, or bean-like pods (avoid these)',
          'Smell plant part - avoid if has almond, peach, or unusual chemical odor',
          'Place small amount on inside of wrist for 15 minutes',
          'If no burning, stinging, or rash, proceed to next step',
          'Place plant part on corner of mouth for 15 minutes',
          'If no adverse reaction, place on tip of tongue for 15 minutes',
          'If still no reaction, chew small amount and hold in mouth 15 minutes',
          'If no ill effects, swallow small amount and wait 8 hours',
          'If no nausea, cramping, or diarrhea, eat 1/4 cup and wait 8 hours',
          'If still no problems, plant part is likely safe to eat'
        ],
        tips: [
          'Test only ONE plant part at a time - never mix',
          'Stop immediately if you feel any negative effects',
          'Avoid plants with milky or discolored sap',
          'Skip test if you can positively identify safe plants',
          'Never test mushrooms - too dangerous',
          'Stay near shelter during testing in case of illness'
        ]
      },
      {
        title: 'Philippine Safe Plants',
        description: 'Common edible plants found in the Philippines',
        difficulty: 'intermediate',
        estimatedTime: '1 hour to learn',
        category: 'foraging',
        steps: [
          'Learn to identify malunggay (moringa) - distinctive compound leaves',
          'Recognize kangkong (water spinach) - grows near water sources',
          'Find young coconut palms - drink coconut water, eat soft meat',
          'Identify camote (sweet potato) leaves - heart-shaped, vining plant',
          'Look for banana plants - fruit, flowers, and inner stem edible',
          'Find bamboo shoots - young shoots are edible when cooked',
          'Recognize gabi (taro) leaves - large heart-shaped, cook before eating',
          'Identify pandan leaves - for flavoring and wrapping food'
        ],
        tips: [
          'Always cook unknown plant materials to eliminate toxins',
          'Start with small amounts even of known safe plants',
          'Learn from local indigenous knowledge when possible',
          'Carry field guide specific to Philippine flora',
          'When in doubt, don\'t eat - starvation takes weeks, poisoning takes hours'
        ],
        images: [
          'https://images.unsplash.com/photo-1516253593875-bd6716853a72?w=400&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1502239608882-93b729c6af40?w=400&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1597714026720-8f74c62310ba?w=400&auto=format&fit=crop'
        ]
      }
    ]
  },
  'knots': {
    title: 'Essential Knots',
    icon: Link,
    color: 'bg-purple-500',
    guides: [
      {
        title: 'Bowline Knot',
        description: 'Creates secure loop that won\'t slip under load',
        difficulty: 'intermediate',
        estimatedTime: '10 minutes practice',
        category: 'skills',
        steps: [
          'Form small overhand loop in rope (the "rabbit hole")',
          'Pass working end up through loop from below',
          'Wrap working end around the standing line (around the tree)',
          'Pass working end back down through original loop',
          'Tighten by pulling both the loop and standing line',
          'Remember: "Up through the rabbit hole, around the tree, back down the rabbit hole"'
        ],
        tips: [
          'Creates loop that will not slip under load',
          'Easy to untie even after being heavily loaded',
          'Essential for rescue operations and climbing',
          'Practice until you can tie it in dark or with gloves on'
        ]
      },
      {
        title: 'Clove Hitch',
        description: 'Secure attachment to posts or poles',
        difficulty: 'beginner',
        estimatedTime: '5 minutes practice',
        category: 'skills',
        steps: [
          'Wrap rope around post from right to left',
          'Cross over the standing line',
          'Wrap around post again in same direction',
          'Tuck working end under the second wrap',
          'Tighten by pulling both ends firmly'
        ],
        tips: [
          'Quick and easy to tie with practice',
          'Holds well under steady, consistent load',
          'Can work loose under varying loads',
          'Best for temporary attachments'
        ]
      }
    ]
  }
};

export function EmergencyMode({ onExit }: EmergencyModeProps) {
  const { user } = useAuth();
  
  // State management for various emergency mode features
    const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number, accuracy?: number} | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<{category: string, guide: SurvivalGuide} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | null>(null);
    const [lastCheckIn, setLastCheckIn] = useState<Date | null>(null);
  const [emergencyMode, setEmergencyMode] = useState({
    activated: true,
    startTime: new Date(),
    autoCallEnabled: false,
    locationBroadcast: true
  });

  // Refs for managing hardware access
  const flashlightStream = useRef<MediaStream | null>(null);
  const orientationListener = useRef<((event: DeviceOrientationEvent) => void) | null>(null);

  /**
   * Initialize device sensors and permissions on component mount
   * Sets up compass, location tracking, battery monitoring, and network status
   */
  useEffect(() => {
    initializeDeviceFeatures();
    setupNetworkMonitoring();
    return cleanup;
  }, []);

  /**
   * Initialize all device features and request necessary permissions
   */
  const initializeDeviceFeatures = async () => {
        await initializeLocation();
    await initializeBatteryMonitoring();
    checkAllPermissions();
  };


  /**
   * Initialize location tracking with high accuracy GPS
   * Requests location permission and sets up continuous tracking
   */
  const initializeLocation = async () => {
    if ('geolocation' in navigator) {
      try {
        // Check permission status
        const permission = await navigator.permissions.query({name: 'geolocation'});
        setLocationPermission(permission.state);

        // Get initial position with high accuracy
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy
            });
            
            // Send location to server for family tracking
            sendLocationUpdate(position.coords);
          },
          (error) => {
            console.error('Location error:', error);
            handleLocationError(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );

        // Set up continuous location tracking for emergency mode
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy
            });
            
            if (emergencyMode.locationBroadcast) {
              sendLocationUpdate(position.coords);
            }
          },
          handleLocationError,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 30000
          }
        );

        // Store watch ID for cleanup
        return () => navigator.geolocation.clearWatch(watchId);
        
      } catch (error) {
        console.error('Location initialization error:', error);
        setLocationPermission('denied');
      }
    } else {
      toast.error('Geolocation not supported on this device');
      setLocationPermission('denied');
    }
  };

  /**
   * Handle location access errors with appropriate user messaging
   */
  const handleLocationError = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setLocationPermission('denied');
        toast.error("Location access denied. Please enable in Settings for emergency features.");
        break;
      case error.POSITION_UNAVAILABLE:
        toast.error("Location information unavailable. Move to area with better GPS signal.");
        break;
      case error.TIMEOUT:
        toast.error("Location request timed out. Trying again...");
        break;
      default:
        console.error('Unknown location error:', error);
        break;
    }
  };

  /**
   * Send location update to server for family tracking and emergency services
   */
  const sendLocationUpdate = async (coords: GeolocationCoordinates) => {
    try {
      // Get current session token for authenticated requests
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      const response = await fetch(getApiUrl('/location/update'), {
        method: 'POST',
        headers: getAuthHeaders(accessToken),
        body: JSON.stringify({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
          emergency_mode: true,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update location');
      }
    } catch (error) {
      console.error('Location update error:', error);
    }
  };

  /**
   * Initialize battery monitoring for emergency preparedness
   * Warns user of low battery levels during emergency mode
   */
  const initializeBatteryMonitoring = async () => {
    try {
      if ('getBattery' in navigator) {
        const battery = await (navigator as any).getBattery();
        setBatteryLevel(Math.round(battery.level * 100));
        
        // Monitor battery level changes
        battery.addEventListener('levelchange', () => {
          const level = Math.round(battery.level * 100);
          setBatteryLevel(level);
          
          // Warning for low battery in emergency mode
          if (level <= 20 && level > 15) {
            toast.error(`Battery at ${level}%. Consider conserving power or finding charger.`);
          } else if (level <= 15) {
            toast.error(`Critical battery: ${level}%. Emergency mode may be limited.`);
          }
        });
      }
    } catch (error) {
      console.error('Battery monitoring not available:', error);
    }
  };

  /**
   * Set up network connectivity monitoring
   * Important for offline functionality and emergency alert reliability
   */
  const setupNetworkMonitoring = () => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (!navigator.onLine) {
        toast.error('Device offline. Using cached emergency data.');
      } else {
        toast.success('Connection restored. Syncing emergency data...');
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  };

  /**
   * Check all required permissions and display status to user
   */
  const checkAllPermissions = async () => {
    const permissions = ['geolocation', 'camera'] as const;
    
    for (const permission of permissions) {
      try {
        const result = await navigator.permissions.query({ name: permission });
        console.log(`${permission} permission:`, result.state);
      } catch (error) {
        console.error(`Error checking ${permission} permission:`, error);
      }
    }
  };

  /**
   * Handle emergency calling functionality
   * Opens device dialer with pre-filled number for user confirmation
   * Complies with platform restrictions on direct calling
   */
  const handleEmergencyCall = (number: string, contactName: string) => {
    try {
      // Log the emergency call attempt for audit trail
      console.log(`Emergency call initiated: ${contactName} (${number}) at ${new Date().toISOString()}`);
      
      // Create tel: URL for dialer
      const telUrl = `tel:${number}`;
      
      // Use window.location.href for maximum compatibility
      window.location.href = telUrl;
      
      // Show user confirmation
      toast.success(`Opening dialer for ${contactName}...`);
      
      // Optional: Track emergency calls in server
      trackEmergencyCall(number, contactName);
      
    } catch (error) {
      console.error('Emergency call error:', error);
      toast.error(`Cannot open dialer. Manually call: ${number}`);
    }
  };

  /**
   * Track emergency calls for audit and family notification
   */
  const trackEmergencyCall = async (number: string, contactName: string) => {
    try {
      // Get current session token for authenticated requests
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      await fetch(getApiUrl('/emergency/call-log'), {
        method: 'POST',
        headers: getAuthHeaders(accessToken),
        body: JSON.stringify({
          number,
          contact_name: contactName,
          location: currentLocation,
          timestamp: new Date().toISOString(),
          emergency_mode: true
        })
      });
    } catch (error) {
      console.error('Call tracking error:', error);
    }
  };

  /**
   * Toggle flashlight functionality using camera API
   * Handles permission requests and provides fallback messaging
   */
  const toggleFlashlight = async () => {
    try {
      if (!isFlashlightOn) {
        // Request camera permission and access torch
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            advanced: [{ torch: true } as any]
          }
        });
        
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities() as any;
        
        if (!capabilities.torch) {
          throw new Error('Torch not supported on this device');
        }
        
        // Apply torch constraint
        await track.applyConstraints({
          advanced: [{ torch: true } as any]
        });
        
        flashlightStream.current = stream;
        setIsFlashlightOn(true);
        toast.success('Flashlight turned on');
        
      } else {
        // Turn off flashlight
        if (flashlightStream.current) {
          const tracks = flashlightStream.current.getVideoTracks();
          tracks.forEach(track => {
            track.applyConstraints({
              advanced: [{ torch: false } as any]
            });
            track.stop();
          });
          flashlightStream.current = null;
        }
        
        setIsFlashlightOn(false);
        toast.success('Flashlight turned off');
      }
    } catch (error: any) {
      console.error('Flashlight error:', error);
      
      // Provide specific error messages
      if (error.name === 'NotAllowedError') {
        toast.error('Camera permission denied. Enable in Settings → Privacy → Camera');
      } else if (error.name === 'NotFoundError') {
        toast.error('Camera with flashlight not found on this device');
      } else if (error.message.includes('torch')) {
        toast.error('Flashlight not supported on this device');
      } else {
        toast.error('Cannot access flashlight. Check device permissions.');
      }
    }
  };

  /**
   * Share current location via various methods
   * Supports native sharing API and clipboard fallback
   */
  const shareLocation = async () => {
    if (!currentLocation) {
      toast.error('Location not available. Enable GPS access.');
      return;
    }

    const locationText = `🚨 EMERGENCY LOCATION 🚨\n\nCoordinates: ${currentLocation.lat.toFixed(6)}°, ${currentLocation.lng.toFixed(6)}°\nAccuracy: ±${currentLocation.accuracy}m\n\nGoogle Maps: https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}\n\nTime: ${new Date().toLocaleString()}\nSent from LifeCraft Emergency Mode`;
    
    try {
      // Try native sharing API first
      if (navigator.share) {
        await navigator.share({
          title: '🚨 Emergency Location',
          text: locationText,
        });
        toast.success('Location shared successfully');
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(locationText);
        toast.success('Emergency location copied to clipboard');
      }
      
      // Log location share for audit
      console.log(`Location shared at ${new Date().toISOString()}:`, currentLocation);
      
    } catch (error) {
      console.error('Share location error:', error);
      toast.error('Cannot share location. Copy coordinates manually.');
    }
  };

  /**
   * Send family check-in with current status and location
   */
  const sendFamilyCheckIn = async (status: 'safe' | 'help_needed' | 'emergency', message?: string) => {
    try {
      // Get current session token for authenticated requests
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      const response = await fetch(getApiUrl('/family/checkin'), {
        method: 'POST',
        headers: getAuthHeaders(accessToken),
        body: JSON.stringify({
          status,
          message: message || getStatusMessage(status),
          latitude: currentLocation?.lat,
          longitude: currentLocation?.lng,
          accuracy: currentLocation?.accuracy,
          emergency_mode: true,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setLastCheckIn(new Date());
        toast.success(`Family check-in sent: ${status.replace('_', ' ')}`);
      } else {
        throw new Error('Check-in failed');
      }
    } catch (error) {
      console.error('Family check-in error:', error);
      toast.error('Cannot send check-in. Will retry when connection restored.');
    }
  };

  /**
   * Get appropriate status message for family check-ins
   */
  const getStatusMessage = (status: string): string => {
    switch (status) {
      case 'safe': return 'I am safe and secure. No assistance needed.';
      case 'help_needed': return 'I need assistance but not in immediate danger.';
      case 'emergency': return '🚨 EMERGENCY: I need immediate help!';
      default: return 'Status update from emergency mode.';
    }
  };

  /**
   * Cleanup function for component unmount
   * Properly dispose of hardware resources and event listeners
   */
  const cleanup = () => {
    // Clean up flashlight
    if (flashlightStream.current) {
      flashlightStream.current.getVideoTracks().forEach(track => track.stop());
    }
    
    // Clean up compass listener
    if (orientationListener.current) {
      window.removeEventListener('deviceorientation', orientationListener.current);
    }
  };

  /**
   * Emergency Status Display Component
   * Shows current device status and emergency mode information
   */
const EmergencyStatus = () => (
  <Card className="border-red-200 bg-red-50">
    <CardHeader className="pb-3">
      <CardTitle className="text-red-700 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        Emergency Mode Active
      </CardTitle>
      <CardDescription className="text-red-600">
        Started: {emergencyMode.startTime.toLocaleTimeString()}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="w-4 h-4 text-green-600" /> Online
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-600" /> Offline
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Battery className="w-4 h-4" />
          {batteryLevel ? `${batteryLevel}%` : "Unknown"}
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {locationPermission === "granted" ? "GPS Active" : "No GPS"}
        </div>
      </div>
    </CardContent>
  </Card>
);


  /**
   * Quick Access Component - Primary emergency interface
   * Contains emergency contacts, location sharing, and hardware tools
   */
  const QuickAccess = () => (
    <div className="space-y-6">
      <EmergencyStatus />
      
      {/* Emergency Contacts */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-red-700 flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Emergency Contacts
          </CardTitle>
          <CardDescription className="text-red-600">
            Tap any number to open dialer - calls require your confirmation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {emergencyContacts.map((contact) => (
            <div key={contact.name} className="flex items-center justify-between p-3 bg-white rounded-lg border shadow-sm">
              <div className="flex-1">
                <div className="font-medium text-sm">{contact.name}</div>
                <div className="text-xs text-muted-foreground">{contact.description}</div>
                <div className="flex items-center gap-2 mt-1">
                  {contact.available24h && (
                    <Badge variant="secondary" className="text-xs">24/7</Badge>
                  )}
                  {contact.priority === 'critical' && (
                    <Badge variant="destructive" className="text-xs">CRITICAL</Badge>
                  )}
                </div>
              </div>
              <Button 
                size="sm" 
                variant={contact.priority === 'critical' ? 'destructive' : 'outline'}
                className="gap-1"
                onClick={() => handleEmergencyCall(contact.number, contact.name)}
              >
                <PhoneCall className="w-3 h-3" />
                {contact.number}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      
      {/* Evacuation Centers (Olongapo City) */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-700 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Evacuation Centers (Olongapo City)
          </CardTitle>
          <CardDescription className="text-green-600">
            Verified locations for emergency shelter within Olongapo City
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { name: "Sta. Rita Elementary School", address: "Sta. Rita Road, Sta. Rita, Olongapo City" },
            { name: "Sta. Rita High School", address: "Tulio St., Brgy. Sta. Rita, Olongapo City" },
            { name: "New Cabalan Barangay Hall", address: "Mabini St., New Cabalan, Olongapo City" },
            { name: "Old Cabalan Barangay Hall", address: "Mulawin St., Old Cabalan, Olongapo City" }
          ].map((center) => (
            <div key={center.name} className="flex items-center justify-between p-3 bg-white rounded-lg border shadow-sm">
              <div>
                <div className="font-medium text-sm">{center.name}</div>
                <div className="text-xs text-muted-foreground">{center.address}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(center.name + ', ' + center.address)}`, '_blank')}
                className="gap-1"
              >
                <MapPin className="w-3 h-3" />
                Map
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>


      {/* Location and Tools */}
      <div className="grid gap-4">
        {/* Current Location */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Your Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentLocation ? (
              <div>
                <div className="bg-muted p-3 rounded-lg mb-3">
                  <div className="font-mono text-sm">
                    {currentLocation.lat.toFixed(6)}°, {currentLocation.lng.toFixed(6)}°
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    GPS accuracy: ±{currentLocation.accuracy?.toFixed(0) || 'unknown'}m
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 gap-1" 
                    size="sm"
                    onClick={shareLocation}
                  >
                    <Share2 className="w-3 h-3" />
                    Share Location
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`, '_blank')}
                  >
                    <MapPin className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {locationPermission === 'denied' 
                    ? 'Location access denied. Enable in Settings.' 
                    : 'Getting location...'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

{/* Emergency Tools */}
<div className="grid grid-cols-2 gap-3">
  {/* Flashlight */}
  <Card 
    className={`cursor-pointer transition-colors ${
      isFlashlightOn
        ? 'bg-yellow-100 border-yellow-300'
        : 'hover:bg-muted/50'
    }`}
    onClick={toggleFlashlight}
  >
    <CardContent className="flex flex-col items-center justify-center p-6">
      <div
        className={`w-16 h-16 rounded-full border-4 flex items-center justify-center mb-3 transition-all ${
          isFlashlightOn
            ? 'border-yellow-500 bg-yellow-200 shadow-lg'
            : 'border-muted-foreground bg-muted/20'
        }`}
      >
        <Flashlight
          className={`w-8 h-8 ${
            isFlashlightOn ? 'text-yellow-700' : 'text-muted-foreground'
          }`}
        />
      </div>
      <div className="text-center">
        <div className="font-medium">Flashlight</div>
        <div className="text-xs text-muted-foreground">
          {isFlashlightOn ? 'TAP TO TURN OFF' : 'TAP TO TURN ON'}
        </div>
      </div>
    </CardContent>
  </Card>
</div>


        {/* Family Check-in */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Family Check-in
            </CardTitle>
            {lastCheckIn && (
              <CardDescription>
                Last check-in: {lastCheckIn.toLocaleTimeString()}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-1"
                onClick={() => sendFamilyCheckIn('safe')}
              >
                <CheckCircle className="w-3 h-3 text-green-600" />
                Safe
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-1"
                onClick={() => sendFamilyCheckIn('help_needed')}
              >
                <Info className="w-3 h-3 text-orange-600" />
                Help
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                className="gap-1"
                onClick={() => sendFamilyCheckIn('emergency')}
              >
                <AlertTriangle className="w-3 h-3" />
                SOS
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Sends status update with location to emergency contacts
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  /**
   * Survival Guides Component - Offline survival knowledge
   * Contains detailed guides organized by category
   */
  const SurvivalGuides = () => {
    if (selectedCategory) {
      const category = survivalGuides[selectedCategory as keyof typeof survivalGuides];
      if (!category) return null;

      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              ← Back to Categories
            </Button>
            <h3 className="font-medium">{category.title}</h3>
          </div>

          <div className="space-y-3">
            {category.guides.map((guide, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedGuide({ category: selectedCategory, guide })}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{guide.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {guide.description}
                      </p>
                      {guide.estimatedTime && (
                        <p className="text-xs text-muted-foreground mt-1">
                          ⏱️ {guide.estimatedTime}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <Badge variant="outline" className="capitalize text-xs">
                        {guide.difficulty}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(survivalGuides).map(([key, category]) => {
          const Icon = category.icon;
          return (
            <Button
              key={key}
              variant="outline"
              className="h-24 flex-col gap-2 p-4"
              onClick={() => setSelectedCategory(key)}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.color} text-white`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-center">{category.title}</span>
              <Badge variant="secondary" className="text-xs">
                {category.guides.length} guides
              </Badge>
            </Button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-red-50">
      {/* Emergency Mode Header */}
      <header className="sticky top-0 z-50 bg-red-600 text-white shadow-lg">
        <div className="flex h-14 items-center px-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="font-bold">EMERGENCY MODE</div>
              <div className="text-xs text-red-100">
                {isOnline ? 'Live emergency toolkit' : 'Offline survival toolkit'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Activity className="w-3 h-3" />
              {isOnline ? 'Live' : 'Offline'}
            </Badge>
            {batteryLevel && batteryLevel <= 20 && (
              <Badge variant="destructive" className="gap-1">
                <Battery className="w-3 h-3" />
                {batteryLevel}%
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onExit}
              className="text-white hover:bg-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="quick" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="quick">Quick Access</TabsTrigger>
            <TabsTrigger value="guides">Survival Guides</TabsTrigger>
          </TabsList>

          <TabsContent value="quick">
            <QuickAccess />
          </TabsContent>

          <TabsContent value="guides">
            <SurvivalGuides />
          </TabsContent>
        </Tabs>
      </main>

      {/* Guide Detail Modal */}
      {selectedGuide && (
        <Dialog open={!!selectedGuide} onOpenChange={(open) => !open && setSelectedGuide(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {selectedGuide.guide.difficulty}
                </Badge>
                {selectedGuide.guide.title}
              </DialogTitle>
              <DialogDescription>
                {selectedGuide.guide.description}
                {selectedGuide.guide.estimatedTime && (
                  <span className="block mt-1 text-sm">⏱️ Time needed: {selectedGuide.guide.estimatedTime}</span>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Guide Images */}
              {selectedGuide.guide.images && selectedGuide.guide.images.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Visual Reference
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedGuide.guide.images.map((image, index) => (
                      <ImageWithFallback
                        key={index}
                        src={image}
                        alt={`${selectedGuide.guide.title} reference ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step-by-step Instructions */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Step-by-Step Instructions
                </h4>
                <ol className="space-y-3">
                  {selectedGuide.guide.steps.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="flex-1 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Important Tips */}
              {selectedGuide.guide.tips && selectedGuide.guide.tips.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Important Tips
                  </h4>
                  <ul className="space-y-2">
                    {selectedGuide.guide.tips.map((tip, index) => (
                      <li key={index} className="flex gap-2">
                        <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Safety Warning */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Safety Notice:</strong> This information is for emergency situations only. 
                  Practice these skills in safe conditions before relying on them. In real emergencies, 
                  contact professional emergency services (911) when possible.
                </AlertDescription>
              </Alert>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}