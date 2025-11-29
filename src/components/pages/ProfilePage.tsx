/**
 * ProfilePage - Page Component
 * Full page component using custom hooks and interfaces
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { User, Edit, Save, X, Loader2 } from 'lucide-react';
import { useProfile, useUpdateProfile } from '../../hooks/useQuery';
import { useAuth } from '../AuthProvider';
import type { UpdateProfileRequest } from '../../interface/api.types';
import { toast } from 'sonner';

export function ProfilePage() {
    const { user } = useAuth();
    const { data: profile, isLoading, error } = useProfile();
    const updateProfileMutation = useUpdateProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UpdateProfileRequest>({
        name: '',
        email: '',
        age: undefined,
        birthdate: '',
        gender: '',
        phone_number: '',
    });

    React.useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                email: profile.email || '',
                age: profile.age,
                birthdate: profile.birthdate || '',
                gender: profile.gender || '',
                phone_number: profile.phone_number || '',
            });
        }
    }, [profile]);

    const handleSave = async () => {
        try {
            await updateProfileMutation.mutateAsync(formData);
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const handleCancel = () => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                email: profile.email || '',
                age: profile.age,
                birthdate: profile.birthdate || '',
                gender: profile.gender || '',
                phone_number: profile.phone_number || '',
            });
        }
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="text-center py-8">
                <p className="text-destructive">Failed to load profile</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Profile Information
                        </CardTitle>
                        {!isEditing ? (
                            <Button variant="outline" onClick={() => setIsEditing(true)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleCancel}>
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} disabled={updateProfileMutation.isLoading}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {updateProfileMutation.isLoading ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={profile.avatar_url} />
                            <AvatarFallback className="text-2xl">
                                {profile.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-xl font-semibold">{profile.name}</h3>
                            <p className="text-muted-foreground">{profile.email}</p>
                            <div className="flex gap-2 mt-2">
                                <Badge>Level {profile.level}</Badge>
                                <Badge variant="secondary">{profile.points} Points</Badge>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            {isEditing ? (
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            ) : (
                                <p className="mt-1">{profile.name}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            {isEditing ? (
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            ) : (
                                <p className="mt-1">{profile.email}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="age">Age</Label>
                            {isEditing ? (
                                <Input
                                    id="age"
                                    type="number"
                                    value={formData.age || ''}
                                    onChange={(e) =>
                                        setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : undefined })
                                    }
                                />
                            ) : (
                                <p className="mt-1">{profile.age || 'Not set'}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            {isEditing ? (
                                <Input
                                    id="phone"
                                    value={formData.phone_number || ''}
                                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                />
                            ) : (
                                <p className="mt-1">{profile.phone_number || 'Not set'}</p>
                            )}
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold">{profile.stats.posts_created}</div>
                                    <div className="text-sm text-muted-foreground">Posts Created</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{profile.stats.guides_downloaded}</div>
                                    <div className="text-sm text-muted-foreground">Guides Downloaded</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{profile.stats.contributions}</div>
                                    <div className="text-sm text-muted-foreground">Contributions</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </div>
    );
}

