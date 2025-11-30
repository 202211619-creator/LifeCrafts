/**
 * CommunityPage - Page Component
 * Full page component using organisms, molecules, and atoms
 * Integrates custom hooks and interfaces
 * Includes SEO optimization
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { PostCard } from '../organisms/PostCard';
import { CommentSection } from '../organisms/CommentSection';
import { PostForm } from '../molecules/PostForm';
import { usePosts, useCreatePost, useLikePost } from '../../hooks/useQuery';
import { useAuth } from '../AuthProvider';
import type { CreatePostRequest, Post } from '../../interface/api.types';
import { toast } from 'sonner';
import { useSEO } from '../../utils/seo';

export function CommunityPage() {
    const { user } = useAuth();
    const { data: posts, isLoading, error, refetch } = usePosts();
    const createPostMutation = useCreatePost();
    const likePostMutation = useLikePost();
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

    // SEO Optimization
    useSEO({
        title: 'Community Exchange',
        description: 'Share knowledge, connect with the community, and exchange survival tips and resources.',
        keywords: ['community', 'survival tips', 'off-grid living', 'emergency preparedness', 'knowledge sharing'],
        ogType: 'website',
    });

    const handleCreatePost = async (data: CreatePostRequest) => {
        try {
            await createPostMutation.mutateAsync(data);
            setIsCreatePostOpen(false);
            toast.success('Post created successfully');
            refetch();
        } catch (error) {
            toast.error('Failed to create post');
        }
    };

    const handleLikePost = async (postId: number) => {
        try {
            await likePostMutation.mutateAsync(postId);
        } catch (error) {
            toast.error('Failed to like post');
        }
    };

    const handleAddComment = async (content: string, parentId?: number) => {
        // TODO: Implement comment creation hook
        toast.info('Comment feature coming soon');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-destructive">Failed to load posts</p>
                <Button onClick={() => refetch()} className="mt-4">
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <main className="space-y-6" role="main">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Community Exchange</h1>
                    <p className="text-muted-foreground">Share knowledge and connect with the community</p>
                </div>
                <Button onClick={() => setIsCreatePostOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Post
                </Button>
            </div>

            <PostForm
                open={isCreatePostOpen}
                onOpenChange={setIsCreatePostOpen}
                onSubmit={handleCreatePost}
                isLoading={createPostMutation.isLoading}
            />

            <div className="space-y-4">
                {posts && posts.length > 0 ? (
                    posts.map((post: Post) => (
                        <div key={post.id}>
                            <PostCard
                                post={post}
                                onLike={handleLikePost}
                                onComment={() => setSelectedPostId(post.id)}
                                currentUserId={user?.id}
                            />
                            {selectedPostId === post.id && (
                                <CommentSection
                                    comments={post.comments}
                                    onAddComment={handleAddComment}
                                    currentUserId={user?.id}
                                />
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No posts yet. Be the first to share!</p>
                    </div>
                )}
            </section>
        </main>
    );
}

