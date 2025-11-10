import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  MapPin, 
  Mail, 
  Phone, 
  Edit, 
  Calendar,
  Users as UsersIcon,
  Award,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useAuth } from './AuthProvider';
import { supabase, projectId } from '../utils/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  age?: number;
  birthdate?: string;
  gender?: string;
  phone_number?: string;
  level: number;
  points: number;
  location_sharing_enabled: boolean;
  created_at: string;
  stats: {
    posts_created: number;
    guides_downloaded: number;
    contributions: number;
  };
}

export function Profile() {
  const { user, signOut, updateProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    age: '',
    birthdate: '',
    gender: '',
    phone_number: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) return;

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3aae099d/profile`, {
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
        },
      });

      const result = await response.json();
      
      if (response.ok && result.profile) {
        setProfile({
          ...result.profile,
          level: result.profile.level || 1,
          points: result.profile.points || 0,
          stats: result.profile.stats || {
            posts_created: 0,
            guides_downloaded: 0,
            contributions: 0
          }
        });
        setEditForm({
          name: result.profile.name || user?.name || '',
          email: result.profile.email || user?.email || '',
          age: result.profile.age?.toString() || '',
          birthdate: result.profile.birthdate || '',
          gender: result.profile.gender || '',
          phone_number: result.profile.phone_number || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      // Validate age if provided
      if (editForm.age && parseInt(editForm.age) < 18) {
        toast.error('You must be at least 18 years old');
        return;
      }

      // Validate birthdate if provided
      if (editForm.birthdate) {
        const birthDate = new Date(editForm.birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        if (age < 18) {
          toast.error('You must be at least 18 years old');
          return;
        }
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        toast.error('Not authenticated');
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3aae099d/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.session.access_token}`,
        },
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          age: editForm.age ? parseInt(editForm.age) : null,
          birthdate: editForm.birthdate || null,
          gender: editForm.gender || null,
          phone_number: editForm.phone_number || null
        }),
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
        setIsEditingProfile(false);
        await fetchProfile();
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Profile not found</h3>
        <p className="text-muted-foreground">Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-lg">
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                {profile.location_sharing_enabled && (
                  <Badge variant="secondary" className="gap-1">
                    <MapPin className="w-3 h-3" />
                    Location Shared
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{profile.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline" className="gap-1">
                  <Award className="w-3 h-3" />
                  Level {profile.level}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {profile.points} points
                </span>
                <span className="text-sm text-muted-foreground">
                  Joined {new Date(profile.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Edit className="w-3 h-3" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Update your personal information.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div>
                      <Label htmlFor="edit-name">Name *</Label>
                      <Input
                        id="edit-name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-email">Email *</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-age">Age (Must be 18+)</Label>
                      <Input
                        id="edit-age"
                        type="number"
                        min="18"
                        max="120"
                        value={editForm.age}
                        onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                        placeholder="18"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-birthdate">Birthdate (Must be 18+)</Label>
                      <Input
                        id="edit-birthdate"
                        type="date"
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                        value={editForm.birthdate}
                        onChange={(e) => setEditForm({ ...editForm, birthdate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-gender">Gender</Label>
                      <select
                        id="edit-gender"
                        value={editForm.gender}
                        onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                        className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-binary</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="edit-phone">Phone Number</Label>
                      <Input
                        id="edit-phone"
                        type="tel"
                        value={editForm.phone_number}
                        onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                        placeholder="+1234567890"
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleUpdateProfile} className="flex-1">
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditingProfile(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Age</div>
                <div className="font-medium">{profile.age || 'Not set'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Birthdate</div>
                <div className="font-medium">
                  {profile.birthdate 
                    ? new Date(profile.birthdate).toLocaleDateString() 
                    : 'Not set'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <UsersIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Gender</div>
                <div className="font-medium capitalize">
                  {profile.gender || 'Not set'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Phone className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Phone Number</div>
                <div className="font-medium">
                  {profile.phone_number || 'Not set'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Activity Statistics
          </CardTitle>
          <CardDescription>
            Your contributions and engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xl font-bold">{profile.stats.posts_created}</div>
                <div className="text-sm text-muted-foreground">Posts Created</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <Settings className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-xl font-bold">{profile.stats.guides_downloaded}</div>
                <div className="text-sm text-muted-foreground">Guides Downloaded</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-xl font-bold">{profile.stats.contributions}</div>
                <div className="text-sm text-muted-foreground">Contributions</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}