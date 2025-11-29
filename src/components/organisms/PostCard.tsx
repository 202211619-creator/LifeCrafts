/**
 * PostCard Organism Component
 * Complex component combining multiple molecules/atoms
 * Uses interfaces and custom hooks
 */

import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ThumbsUp, MessageCircle, Eye, Download, MoreVertical } from 'lucide-react';
import type { Post } from '../../interface/api.types';

interface PostCardProps {
    post: Post;
    onLike?: (postId: number) => void;
    onComment?: (postId: number) => void;
    onView?: (postId: number) => void;
    onDownload?: (postId: number) => void;
    currentUserId?: string;
}

export function PostCard({
    post,
    onLike,
    onComment,
    onView,
    onDownload,
    currentUserId,
}: PostCardProps) {
    const isOwner = post.user_id === currentUserId;

    return (
        <Card className="mb-4">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{post.author.name}</span>
                                <Badge variant="secondary">{post.author.badge}</Badge>
                                <Badge variant="outline">Level {post.author.level}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{post.timeAgo}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge>{post.category}</Badge>
                        {isOwner && (
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                <p className="text-muted-foreground mb-4">{post.description}</p>

                {post.image && (
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full rounded-lg mb-4"
                    />
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onLike?.(post.id)}
                        className={post.isLiked ? 'text-primary' : ''}
                    >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {post.likes}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onComment?.(post.id)}
                    >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.comments.length}
                    </Button>
                    <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views}
                    </div>
                    {post.fileUrl && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDownload?.(post.id)}
                        >
                            <Download className="w-4 h-4 mr-1" />
                            {post.downloads}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

