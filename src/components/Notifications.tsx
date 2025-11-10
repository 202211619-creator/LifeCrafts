import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Users,
  ShoppingCart,
  Trophy,
  CheckCircle,
  X,
  Eye,
  Trash2,
  Settings,
  Clock,
  Zap,
  MessageSquare,
  Star
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

interface NotificationsProps {
  notifications: any[];
  onMarkAsRead: (id: number) => void;
  onDeleteNotification: (id: number) => void;
  onMarkAllAsRead: () => void;
}

export function Notifications({ 
  notifications = [], 
  onMarkAsRead, 
  onDeleteNotification, 
  onMarkAllAsRead 
}: NotificationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Default notifications if none provided
  const defaultNotifications = [
    {
      id: 1,
      type: 'emergency',
      title: 'Typhoon Warning Update',
      message: 'Signal #3 has been raised for Metro Manila. Check your emergency kit.',
      time: '5 minutes ago',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'achievement',
      title: 'New Achievement Unlocked!',
      message: 'You earned the "Community Helper" badge for helping 50+ members.',
      time: '2 hours ago',
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'community',
      title: 'New Guide Shared',
      message: 'Maria Santos shared "Urban Composting for Beginners" in your area.',
      time: '4 hours ago',
      read: true,
      priority: 'medium'
    },
    {
      id: 4,
      type: 'marketplace',
      title: 'Trade Request',
      message: 'Juan wants to trade tomato seeds for your lettuce seedlings.',
      time: '6 hours ago',
      read: false,
      priority: 'low'
    },
    {
      id: 5,
      type: 'system',
      title: 'Offline Content Updated',
      message: 'New emergency guides are available for download.',
      time: '1 day ago',
      read: true,
      priority: 'medium'
    },
    {
      id: 6,
      type: 'community',
      title: 'Challenge Invitation',
      message: 'Join the "30-Day Water Conservation Challenge" starting tomorrow.',
      time: '2 days ago',
      read: false,
      priority: 'low'
    }
  ];

  const activeNotifications = notifications.length > 0 ? notifications : defaultNotifications;
  const unreadCount = activeNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'emergency': return AlertTriangle;
      case 'achievement': return Trophy;
      case 'community': return Users;
      case 'marketplace': return ShoppingCart;
      case 'system': return Bell;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (type === 'emergency' || priority === 'high') return 'destructive';
    if (priority === 'medium') return 'default';
    return 'secondary';
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return { label: 'Urgent', variant: 'destructive' as const };
      case 'medium': return { label: 'Important', variant: 'default' as const };
      case 'low': return { label: 'Info', variant: 'secondary' as const };
      default: return { label: 'Info', variant: 'secondary' as const };
    }
  };

  const categorizedNotifications = {
    all: activeNotifications,
    emergency: activeNotifications.filter(n => n.type === 'emergency'),
    community: activeNotifications.filter(n => n.type === 'community'),
    marketplace: activeNotifications.filter(n => n.type === 'marketplace'),
    achievements: activeNotifications.filter(n => n.type === 'achievement'),
    system: activeNotifications.filter(n => n.type === 'system')
  };

  const NotificationItem = ({ notification, showActions = true }: { notification: any, showActions?: boolean }) => {
    const IconComponent = getNotificationIcon(notification.type);
    const priorityBadge = getPriorityBadge(notification.priority);

    return (
      <div className={`p-4 border rounded-lg ${!notification.read ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'}`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${notification.type === 'emergency' ? 'bg-destructive/10' : 'bg-primary/10'}`}>
            <IconComponent className={`w-4 h-4 ${notification.type === 'emergency' ? 'text-destructive' : 'text-primary'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                  <Badge variant={priorityBadge.variant} className="text-xs">
                    {priorityBadge.label}
                  </Badge>
                </div>
              </div>
              {showActions && (
                <div className="flex items-center gap-1">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onDeleteNotification(notification.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3 bg-transparent border-0">
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <h3 className="font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount} new</Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="px-4 pt-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="text-xs">
                All ({activeNotifications.length})
              </TabsTrigger>
              <TabsTrigger value="emergency" className="text-xs">
                Emergency ({categorizedNotifications.emergency.length})
              </TabsTrigger>
              <TabsTrigger value="community" className="text-xs">
                Community ({categorizedNotifications.community.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <TabsContent value="all" className="p-4 pt-2 m-0">
              <div className="space-y-3">
                {activeNotifications.length > 0 ? (
                  activeNotifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="emergency" className="p-4 pt-2 m-0">
              <div className="space-y-3">
                {categorizedNotifications.emergency.length > 0 ? (
                  categorizedNotifications.emergency.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No emergency alerts</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="community" className="p-4 pt-2 m-0">
              <div className="space-y-3">
                {categorizedNotifications.community.length > 0 ? (
                  categorizedNotifications.community.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No community updates</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="border-t p-4">
          <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
            View All Notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Simple notification bell for header
export function NotificationBell({ 
  unreadCount = 0, 
  onClick 
}: { 
  unreadCount?: number; 
  onClick?: () => void; 
}) {
  return (
    <button 
      className="relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3 bg-transparent border-0"
      onClick={onClick}
    >
      <Bell className="w-4 h-4" />
      {unreadCount > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </button>
  );
}