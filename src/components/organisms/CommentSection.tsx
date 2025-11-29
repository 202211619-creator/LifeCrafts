/**
 * CommentSection Organism Component
 * Complex component for displaying and managing comments
 * Uses interfaces
 */

import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { ThumbsUp, Reply, Send } from 'lucide-react';
import type { Comment } from '../../interface/api.types';

interface CommentSectionProps {
    comments: Comment[];
    onAddComment?: (content: string, parentId?: number) => void;
    onLikeComment?: (commentId: number) => void;
    currentUserId?: string;
}

export function CommentSection({
    comments,
    onAddComment,
    onLikeComment,
    currentUserId,
}: CommentSectionProps) {
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);

    const handleSubmit = () => {
        if (!newComment.trim()) return;
        onAddComment?.(newComment, replyingTo || undefined);
        setNewComment('');
        setReplyingTo(null);
    };

    return (
        <div className="mt-4 space-y-4">
            <div className="flex gap-2">
                <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1"
                />
                <Button onClick={handleSubmit} size="icon">
                    <Send className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-3">
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        onLike={onLikeComment}
                        onReply={() => setReplyingTo(comment.id)}
                        currentUserId={currentUserId}
                    />
                ))}
            </div>
        </div>
    );
}

function CommentItem({
    comment,
    onLike,
    onReply,
    currentUserId,
}: {
    comment: Comment;
    onLike?: (id: number) => void;
    onReply?: () => void;
    currentUserId?: string;
}) {
    return (
        <Card>
            <CardContent className="pt-4">
                <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{comment.author.name}</span>
                            <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                        </div>
                        <p className="text-sm mb-2">{comment.content}</p>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onLike?.(comment.id)}
                                className={comment.isLiked ? 'text-primary' : ''}
                            >
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                {comment.likes}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={onReply}>
                                <Reply className="w-3 h-3 mr-1" />
                                Reply
                            </Button>
                        </div>
                        {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-3 ml-4 space-y-2 border-l-2 pl-3">
                                {comment.replies.map((reply) => (
                                    <CommentItem
                                        key={reply.id}
                                        comment={reply}
                                        onLike={onLike}
                                        currentUserId={currentUserId}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

