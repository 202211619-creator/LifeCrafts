import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import {
  BookOpen,
  Calculator,
  Users,
  Zap,
  Download,
  Bot,
  User,
  AlertTriangle,
  LogOut,
  Shield,
  Leaf
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Badge } from './components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { AuthForm } from './components/AuthForm';
import { Login } from './components/Login';
import { ResetPassword } from './components/ResetPassword';
import { KnowledgeHub } from './components/KnowledgeHub';
import { ToolsCalculators } from './components/ToolsCalculators';
import { CommunityExchange } from './components/CommunityExchange';
import { EmergencyMode } from './components/EmergencyMode';
import { EmergencyPreparedness } from './components/EmergencyPreparedness';
import { AIHub } from './components/AIHub';
import { OfflineManager } from './components/OfflineManager';
import { Profile } from './components/Profile';
import { Notifications } from './components/Notifications';

function Dashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('knowledge');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Calculate time ago helper
  const calculateTimeAgo = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  // Fetch emergency alerts from MapaKalamidad API
  const fetchEmergencyNotifications = async () => {
    try {
      const response = await fetch(
        "https://corsproxy.io/?" +
        encodeURIComponent("https://api.mapakalamidad.ph/reports")
      );
      const data = await response.json();

      const reports = Array.isArray(data)
        ? data
        : Array.isArray(data.reports)
          ? data.reports
          : [];

      // Convert emergency alerts to notifications format
      const emergencyNotifications = reports
        .filter((item: any) =>
          ["flood", "earthquake", "fire", "typhoon"].includes(
            (item.category || "").toLowerCase()
          )
        )
        .slice(0, 3) // Take top 3 most critical
        .map((item: any, index: number) => {
          const severity = item.status === "verified" ? "critical" :
            item.status === "new" ? "high" : "medium";
          const timeAgo = calculateTimeAgo(new Date(item.updated_at || item.created_at));

          return {
            id: `emergency-${item.id || index}`,
            type: 'emergency',
            title: item.type
              ? `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Alert - ${item.location?.name || 'Unknown area'}`
              : 'Emergency Alert',
            message: item.description || 'Check emergency preparedness section for details.',
            time: timeAgo,
            read: false,
            priority: severity,
            source: 'MapaKalamidad.ph',
            actionRequired: severity === 'critical' || severity === 'high'
          };
        });

      // Add static notifications for family and community
      const staticNotifications = [
        {
          id: 'family-1',
          type: 'family',
          title: 'Family Check-in Required',
          message: 'Your emergency contacts have not heard from you in 12 hours. Send status update.',
          time: '15 minutes ago',
          read: false,
          priority: 'high'
        },
        {
          id: 'community-1',
          type: 'community',
          title: 'Emergency Kit Shared Nearby',
          message: 'Juan dela Cruz shared "72-Hour Emergency Kit Guide" for Quezon City residents.',
          time: '1 hour ago',
          read: true,
          priority: 'medium'
        },
        {
          id: 'system-1',
          type: 'system',
          title: 'Offline Content Downloaded',
          message: 'First Aid & Medical Emergency guide pack (45MB) ready for offline use.',
          time: '2 hours ago',
          read: true,
          priority: 'low'
        }
      ];

      // If no emergency notifications, use test data
      if (emergencyNotifications.length === 0) {
        const testEmergencyNotifications = [
          {
            id: 'test-1',
            type: 'emergency',
            title: 'Test: Typhoon "Pepito" Signal #3',
            message: 'PAGASA: Strong winds expected in 18 hours. Metro Manila, Rizal affected. Check emergency supplies now.',
            time: '3 minutes ago',
            read: false,
            priority: 'critical',
            source: 'PAGASA (Test Data)',
            actionRequired: true
          },
          {
            id: 'test-2',
            type: 'emergency',
            title: 'Test: Flood Alert - Marikina River',
            message: 'Water level: 17.2m (Critical). Residents in low areas prepare for possible evacuation.',
            time: '8 minutes ago',
            read: false,
            priority: 'high',
            source: 'MMDA (Test Data)'
          },
          {
            id: 'test-3',
            type: 'emergency',
            title: 'Test: Earthquake Drill Reminder',
            message: 'Nationwide earthquake drill scheduled for next week. Review your emergency procedures.',
            time: '1 hour ago',
            read: false,
            priority: 'medium',
            source: 'NDRRMC (Test Data)'
          }
        ];
        setNotifications([...testEmergencyNotifications, ...staticNotifications]);
      } else {
        setNotifications([...emergencyNotifications, ...staticNotifications]);
      }
    } catch (error) {
      console.error("Error fetching emergency notifications:", error);
      // Fallback to test data if API fails
      const fallbackNotifications = [
        {
          id: 'fallback-1',
          type: 'emergency',
          title: 'Test: Typhoon "Pepito" Signal #3',
          message: 'PAGASA: Strong winds expected in 18 hours. Metro Manila, Rizal affected. Check emergency supplies now.',
          time: '3 minutes ago',
          read: false,
          priority: 'critical',
          source: 'PAGASA (Test Data)',
          actionRequired: true
        },
        {
          id: 'fallback-2',
          type: 'emergency',
          title: 'Test: Flood Alert - Marikina River',
          message: 'Water level: 17.2m (Critical). Residents in low areas prepare for possible evacuation.',
          time: '8 minutes ago',
          read: false,
          priority: 'high',
          source: 'MMDA (Test Data)'
        },
        {
          id: 'fallback-3',
          type: 'family',
          title: 'Family Check-in Required',
          message: 'Your emergency contacts have not heard from you in 12 hours. Send status update.',
          time: '15 minutes ago',
          read: false,
          priority: 'high'
        },
        {
          id: 'fallback-4',
          type: 'community',
          title: 'Emergency Kit Shared Nearby',
          message: 'Juan dela Cruz shared "72-Hour Emergency Kit Guide" for Quezon City residents.',
          time: '1 hour ago',
          read: true,
          priority: 'medium'
        },
        {
          id: 'fallback-5',
          type: 'system',
          title: 'Offline Content Downloaded',
          message: 'First Aid & Medical Emergency guide pack (45MB) ready for offline use.',
          time: '2 hours ago',
          read: true,
          priority: 'low'
        }
      ];
      setNotifications(fallbackNotifications);
    }
  };

  const handleMarkAsRead = (id: number | string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDeleteNotification = (id: number | string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  // Initialize and refresh notifications
  useEffect(() => {
    if (user) {
      fetchEmergencyNotifications();
      // Auto-refresh every 2 minutes
      const interval = setInterval(fetchEmergencyNotifications, 120000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [user]);

  if (isEmergencyMode) {
    return <EmergencyMode onExit={() => setIsEmergencyMode(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex h-16 items-center px-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 via-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-green-700">LifeCraft</h1>
              <p className="text-xs text-muted-foreground">Off-grid Living & Survival</p>
            </div>
          </div>

          {/* Search - Hidden */}
          <div className="flex-1 mx-6">
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-right">
                <div className="text-sm font-medium">Welcome back!</div>
                <div className="text-xs text-muted-foreground">{user?.name}</div>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Leaf className="w-3 h-3" />
                Connected
              </Badge>
            </div>

            {/* Notifications */}
            <Notifications
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onDeleteNotification={handleDeleteNotification}
              onMarkAllAsRead={handleMarkAllAsRead}
            />

            {/* Emergency Button */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsEmergencyMode(true)}
              className="gap-2 animate-pulse"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">SOS</span>
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-8 w-8 rounded-full inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground bg-transparent border-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab('profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile & Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab('location')}>
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>Family Tracking</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab('emergency')}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Emergency Prep</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Enhanced Navigation */}
          <div className="mb-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto gap-1">
              <TabsTrigger value="knowledge" className="flex-col gap-1 h-16 px-2">
                <BookOpen className="w-5 h-5" />
                <span className="text-xs">Knowledge</span>
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex-col gap-1 h-16 px-2">
                <Calculator className="w-5 h-5" />
                <span className="text-xs">Tools</span>
              </TabsTrigger>
              <TabsTrigger value="emergency" className="flex-col gap-1 h-16 px-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-xs">Emergency</span>
              </TabsTrigger>
              <TabsTrigger value="community" className="flex-col gap-1 h-16 px-2">
                <Users className="w-5 h-5" />
                <span className="text-xs">Community</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex-col gap-1 h-16 px-2">
                <Bot className="w-5 h-5" />
                <span className="text-xs">AI Assistant</span>
              </TabsTrigger>
              <TabsTrigger value="offline" className="flex-col gap-1 h-16 px-2">
                <Download className="w-5 h-5" />
                <span className="text-xs">Offline</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex-col gap-1 h-16 px-2">
                <User className="w-5 h-5" />
                <span className="text-xs">Profile</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents */}
          <TabsContent value="knowledge">
            <KnowledgeHub />
          </TabsContent>

          <TabsContent value="tools">
            <ToolsCalculators />
          </TabsContent>

          <TabsContent value="emergency">
            <EmergencyPreparedness />
          </TabsContent>

          <TabsContent value="community">
            <CommunityExchange />
          </TabsContent>

          <TabsContent value="ai">
            <AIHub />
          </TabsContent>

          <TabsContent value="offline">
            <OfflineManager />
          </TabsContent>

          <TabsContent value="profile">
            <Profile />
          </TabsContent>
        </Tabs>
      </main>

      {/* Quick Stats Footer */}
      <footer className="border-t bg-muted/30 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">30</div>
              <div className="text-sm text-muted-foreground">Survival Guides</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">5</div>
              <div className="text-sm text-muted-foreground">Active Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">4</div>
              <div className="text-sm text-muted-foreground">Real-time Alerts</div>
            </div>
          </div>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>LifeCraft - Your Complete Off-grid Living & Emergency Preparedness Ecosystem</p>
            <p className="text-xs mt-1">Real-time Emergency Alerts via MapaKalamidad.ph</p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

function AppContent() {
  const [mockUser, setMockUser] = useState<any>(null);
  const { user, loading } = useAuth();
  const location = useLocation();

  // If we have a mock user, use that instead of Supabase auth
  if (mockUser) {
    return <DashboardWrapper user={mockUser} onLogout={() => setMockUser(null)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Leaf className="w-12 h-12 text-green-600 animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow reset-password route even without authentication
  if (location.pathname === '/reset-password') {
    return <ResetPassword />;
  }

  // Show mock login form
  if (!user) {
    return <Login onLogin={setMockUser} />;
  }

  return <Dashboard />;
}

// Wrapper component for mock user
function DashboardWrapper({ user: mockUser, onLogout }: { user: any; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('knowledge');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Calculate time ago helper
  const calculateTimeAgo = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  // Fetch emergency notifications
  const fetchEmergencyNotifications = async () => {
    try {
      const response = await fetch(
        "https://corsproxy.io/?" +
        encodeURIComponent("https://api.mapakalamidad.ph/reports")
      );
      const data = await response.json();

      const reports = Array.isArray(data)
        ? data
        : Array.isArray(data.reports)
          ? data.reports
          : [];

      const emergencyNotifications = reports
        .filter((item: any) =>
          ["flood", "earthquake", "fire", "typhoon"].includes(
            (item.category || "").toLowerCase()
          )
        )
        .slice(0, 3)
        .map((item: any, index: number) => {
          const severity = item.status === "verified" ? "critical" :
            item.status === "new" ? "high" : "medium";
          const timeAgo = calculateTimeAgo(new Date(item.updated_at || item.created_at));

          return {
            id: `emergency-${item.id || index}`,
            type: 'emergency',
            title: item.type
              ? `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Alert - ${item.location?.name || 'Unknown area'}`
              : 'Emergency Alert',
            message: item.description || 'Check emergency preparedness section for details.',
            time: timeAgo,
            read: false,
            priority: severity,
            source: 'MapaKalamidad.ph',
            actionRequired: severity === 'critical' || severity === 'high'
          };
        });

      const staticNotifications = [
        {
          id: 'family-1',
          type: 'family',
          title: 'Family Check-in Required',
          message: 'Your emergency contacts have not heard from you in 12 hours. Send status update.',
          time: '15 minutes ago',
          read: false,
          priority: 'high'
        },
        {
          id: 'community-1',
          type: 'community',
          title: 'Emergency Kit Shared Nearby',
          message: 'Juan dela Cruz shared "72-Hour Emergency Kit Guide" for Quezon City residents.',
          time: '1 hour ago',
          read: true,
          priority: 'medium'
        },
        {
          id: 'system-1',
          type: 'system',
          title: 'Offline Content Downloaded',
          message: 'First Aid & Medical Emergency guide pack (45MB) ready for offline use.',
          time: '2 hours ago',
          read: true,
          priority: 'low'
        }
      ];

      if (emergencyNotifications.length === 0) {
        const testEmergencyNotifications = [
          {
            id: 'test-1',
            type: 'emergency',
            title: 'Test: Typhoon "Pepito" Signal #3',
            message: 'PAGASA: Strong winds expected in 18 hours. Metro Manila, Rizal affected. Check emergency supplies now.',
            time: '3 minutes ago',
            read: false,
            priority: 'critical',
            source: 'PAGASA (Test Data)',
            actionRequired: true
          },
          {
            id: 'test-2',
            type: 'emergency',
            title: 'Test: Flood Alert - Marikina River',
            message: 'Water level: 17.2m (Critical). Residents in low areas prepare for possible evacuation.',
            time: '8 minutes ago',
            read: false,
            priority: 'high',
            source: 'MMDA (Test Data)'
          },
          {
            id: 'test-3',
            type: 'emergency',
            title: 'Test: Earthquake Drill Reminder',
            message: 'Nationwide earthquake drill scheduled for next week. Review your emergency procedures.',
            time: '1 hour ago',
            read: false,
            priority: 'medium',
            source: 'NDRRMC (Test Data)'
          }
        ];
        setNotifications([...testEmergencyNotifications, ...staticNotifications]);
      } else {
        setNotifications([...emergencyNotifications, ...staticNotifications]);
      }
    } catch (error) {
      console.error("Error fetching emergency notifications:", error);
      const fallbackNotifications = [
        {
          id: 'fallback-1',
          type: 'emergency',
          title: 'Test: Typhoon "Pepito" Signal #3',
          message: 'PAGASA: Strong winds expected in 18 hours. Metro Manila, Rizal affected. Check emergency supplies now.',
          time: '3 minutes ago',
          read: false,
          priority: 'critical',
          source: 'PAGASA (Test Data)',
          actionRequired: true
        },
        {
          id: 'fallback-2',
          type: 'emergency',
          title: 'Test: Flood Alert - Marikina River',
          message: 'Water level: 17.2m (Critical). Residents in low areas prepare for possible evacuation.',
          time: '8 minutes ago',
          read: false,
          priority: 'high',
          source: 'MMDA (Test Data)'
        },
        {
          id: 'fallback-3',
          type: 'family',
          title: 'Family Check-in Required',
          message: 'Your emergency contacts have not heard from you in 12 hours. Send status update.',
          time: '15 minutes ago',
          read: false,
          priority: 'high'
        },
        {
          id: 'fallback-4',
          type: 'community',
          title: 'Emergency Kit Shared Nearby',
          message: 'Juan dela Cruz shared "72-Hour Emergency Kit Guide" for Quezon City residents.',
          time: '1 hour ago',
          read: true,
          priority: 'medium'
        },
        {
          id: 'fallback-5',
          type: 'system',
          title: 'Offline Content Downloaded',
          message: 'First Aid & Medical Emergency guide pack (45MB) ready for offline use.',
          time: '2 hours ago',
          read: true,
          priority: 'low'
        }
      ];
      setNotifications(fallbackNotifications);
    }
  };

  const handleMarkAsRead = (id: number | string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDeleteNotification = (id: number | string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    if (mockUser) {
      fetchEmergencyNotifications();
      const interval = setInterval(fetchEmergencyNotifications, 120000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [mockUser]);

  if (isEmergencyMode) {
    return <EmergencyMode onExit={() => setIsEmergencyMode(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex h-16 items-center px-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 via-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-green-700">LifeCraft</h1>
              <p className="text-xs text-muted-foreground">Off-grid Living & Survival</p>
            </div>
          </div>

          {/* Search - Hidden */}
          <div className="flex-1 mx-6">
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-right">
                <div className="text-sm font-medium">Welcome back!</div>
                <div className="text-xs text-muted-foreground">{mockUser?.name}</div>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Leaf className="w-3 h-3" />
                Connected
              </Badge>
            </div>

            {/* Notifications */}
            <Notifications
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onDeleteNotification={handleDeleteNotification}
              onMarkAllAsRead={handleMarkAllAsRead}
            />

            {/* Emergency Button */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsEmergencyMode(true)}
              className="gap-2 animate-pulse"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">SOS</span>
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-8 w-8 rounded-full inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground bg-transparent border-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mockUser?.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {mockUser?.avatar || mockUser?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{mockUser?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{mockUser?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab('profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile & Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab('emergency')}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Emergency Prep</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Enhanced Navigation */}
          <div className="mb-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 h-auto gap-1">
              <TabsTrigger value="knowledge" className="flex-col gap-1 h-16 px-2">
                <BookOpen className="w-5 h-5" />
                <span className="text-xs">Knowledge</span>
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex-col gap-1 h-16 px-2">
                <Calculator className="w-5 h-5" />
                <span className="text-xs">Tools</span>
              </TabsTrigger>
              <TabsTrigger value="emergency" className="flex-col gap-1 h-16 px-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-xs">Emergency</span>
              </TabsTrigger>
              <TabsTrigger value="community" className="flex-col gap-1 h-16 px-2">
                <Users className="w-5 h-5" />
                <span className="text-xs">Community</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex-col gap-1 h-16 px-2">
                <Bot className="w-5 h-5" />
                <span className="text-xs">AI Assistant</span>
              </TabsTrigger>
              <TabsTrigger value="offline" className="flex-col gap-1 h-16 px-2">
                <Download className="w-5 h-5" />
                <span className="text-xs">Offline</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex-col gap-1 h-16 px-2">
                <User className="w-5 h-5" />
                <span className="text-xs">Profile</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents */}
          <TabsContent value="knowledge">
            <KnowledgeHub />
          </TabsContent>

          <TabsContent value="tools">
            <ToolsCalculators />
          </TabsContent>

          <TabsContent value="emergency">
            <EmergencyPreparedness />
          </TabsContent>

          <TabsContent value="community">
            <CommunityExchange />
          </TabsContent>

          <TabsContent value="ai">
            <AIHub />
          </TabsContent>

          <TabsContent value="offline">
            <OfflineManager />
          </TabsContent>

          <TabsContent value="profile">
            <Profile />
          </TabsContent>
        </Tabs>
      </main>

      {/* Quick Stats Footer */}
      <footer className="border-t bg-muted/30 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">30</div>
              <div className="text-sm text-muted-foreground">Survival Guides</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">5</div>
              <div className="text-sm text-muted-foreground">Active Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">4</div>
              <div className="text-sm text-muted-foreground">Real-time Alerts</div>
            </div>
          </div>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>LifeCraft - Your Complete Off-grid Living & Emergency Preparedness Ecosystem</p>
            <p className="text-xs mt-1">Real-time Emergency Alerts via MapaKalamidad.ph</p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/reset-password" element={<AppContent />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}