/**
 * PostForm Molecule Component
 * Combines form inputs and buttons
 * Uses interfaces
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { CreatePostRequest } from '../../interface/api.types';

interface PostFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreatePostRequest) => void;
    isLoading?: boolean;
    initialData?: Partial<CreatePostRequest>;
}

export function PostForm({
    open,
    onOpenChange,
    onSubmit,
    isLoading = false,
    initialData,
}: PostFormProps) {
    const [formData, setFormData] = React.useState<CreatePostRequest>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        content: initialData?.content || '',
        category: initialData?.category || 'General',
    });
    const [file, setFile] = React.useState<File | null>(initialData?.file || null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...formData, file: file || undefined });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create New Post</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="content">Content (Optional)</Label>
                        <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={6}
                        />
                    </div>
                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="General">General</SelectItem>
                                <SelectItem value="Survival Tips">Survival Tips</SelectItem>
                                <SelectItem value="Emergency Prep">Emergency Prep</SelectItem>
                                <SelectItem value="Off-grid Living">Off-grid Living</SelectItem>
                                <SelectItem value="Resources">Resources</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="file">Attach File (Optional)</Label>
                        <Input
                            id="file"
                            type="file"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            accept="image/*,video/*,.pdf"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Post'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

