import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, Star, MessageCircle, ThumbsUp, Upload, Award,
  MoreVertical, Edit, Trash2, Share2, Heart, Camera, FileText, Play,
  Send, Reply, X, Eye, Download, Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { supabase } from '../utils/supabase/client';

interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
    level: number;
  };
  content: string;
  timeAgo: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface Post {
  id: number;
  user_id?: string;
  author: {
    name: string;
    avatar: string;
    badge: string;
    level: number;
    user_id?: string;
  };
  title: string;
  description: string;
  content?: string;
  image?: string;
  fileUrl?: string;
  fileType?: 'pdf' | 'mp4' | 'image';
  fileName?: string;
  likes: number;
  comments: Comment[];
  rating: number;
  category: string;
  timeAgo: string;
  isLiked: boolean;
  views: number;
  downloads: number;
  created_at?: string;
}

export function CommunityExchange() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create Post Form State
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    content: '',
    category: 'General',
    file: null as File | null
  });

  // Load current user and posts on mount
  useEffect(() => {
    getCurrentUser();
    loadPosts();
  }, []);

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user loaded:', user?.id);
      setCurrentUserId(user?.id || null);
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          comments:community_comments(
            *,
            replies:community_comments!parent_comment_id(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match Post interface
      const transformedPosts = data?.map(post => {
        console.log('Post data:', {
          id: post.id,
          title: post.title,
          user_id: post.user_id,
          author_name: post.author_name
        });
        
        return {
          id: post.id,
          user_id: post.user_id,
          author: {
            name: post.author_name,
            avatar: post.author_avatar,
            badge: post.author_badge,
            level: post.author_level,
            user_id: post.user_id
          },
          title: post.title,
          description: post.description,
          content: post.content,
          image: post.image_url,
          fileUrl: post.file_url,
          fileType: post.file_type,
          fileName: post.file_name,
          likes: post.likes,
          comments: post.comments?.filter((c: any) => !c.parent_comment_id).map((c: any) => ({
            id: c.id,
            author: {
              name: c.author_name,
              avatar: c.author_avatar,
              level: c.author_level
            },
            content: c.content,
            timeAgo: getTimeAgo(c.created_at),
            likes: c.likes,
            isLiked: false,
            replies: c.replies?.map((r: any) => ({
              id: r.id,
              author: {
                name: r.author_name,
                avatar: r.author_avatar,
                level: r.author_level
              },
              content: r.content,
              timeAgo: getTimeAgo(r.created_at),
              likes: r.likes,
              isLiked: false
            }))
          })) || [],
          rating: post.rating,
          category: post.category,
          timeAgo: getTimeAgo(post.created_at),
          isLiked: false,
          views: post.views,
          downloads: post.downloads,
          created_at: post.created_at
        };
      }) || [];

      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const uploadFile = async (file: File): Promise<{ url: string; type: string } | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `community/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      let fileType = 'image';
      if (file.type.includes('pdf')) fileType = 'pdf';
      else if (file.type.includes('video')) fileType = 'mp4';

      return { url: publicUrl, type: fileType };
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      return null;
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.description) {
      toast.error('Please fill in title and description');
      return;
    }

    try {
      setIsUploading(true);

      let fileUrl = null;
      let fileType = null;
      let fileName = null;
      let imageUrl = null;

      // Upload file if present
      if (newPost.file) {
        const uploadResult = await uploadFile(newPost.file);
        if (uploadResult) {
          fileUrl = uploadResult.url;
          fileType = uploadResult.type;
          fileName = newPost.file.name;
          
          if (newPost.file.type.startsWith('image/')) {
            imageUrl = uploadResult.url;
          }
        }
      }

      // Get current user with profile data
      const user = await getCurrentUser();
      
      if (!user) {
        toast.error('You must be logged in to create a post');
        return;
      }

      // Fetch user profile from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, avatar_url, level')
        .eq('id', user.id)
        .single();

      // Insert post into database
      const { data, error } = await supabase
        .from('community_posts')
        .insert([
          {
            title: newPost.title,
            description: newPost.description,
            content: newPost.content,
            category: newPost.category,
            file_url: fileUrl,
            file_type: fileType,
            file_name: fileName,
            image_url: imageUrl,
            user_id: user.id,
            author_name: profile?.name || user.email?.split('@')[0] || 'Anonymous',
            author_avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
            author_badge: 'Community Member',
            author_level: profile?.level || 1,
            likes: 0,
            views: 0,
            downloads: 0,
            rating: 0
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Reload posts
      await loadPosts();
      
      setNewPost({ title: '', description: '', content: '', category: 'General', file: null });
      setIsCreatePostOpen(false);
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      description: post.description,
      content: post.content || '',
      category: post.category,
      file: null
    });
    setIsCreatePostOpen(true);
  };

  const handleUpdatePost = async () => {
    if (!editingPost || !newPost.title || !newPost.description) {
      toast.error('Please fill in title and description');
      return;
    }

    try {
      setIsUploading(true);

      let fileUrl = editingPost.fileUrl;
      let fileType = editingPost.fileType;
      let fileName = editingPost.fileName;
      let imageUrl = editingPost.image;

      // Upload new file if present
      if (newPost.file) {
        const uploadResult = await uploadFile(newPost.file);
        if (uploadResult) {
          fileUrl = uploadResult.url;
          fileType = uploadResult.type as any;
          fileName = newPost.file.name;
          
          if (newPost.file.type.startsWith('image/')) {
            imageUrl = uploadResult.url;
          }
        }
      }

      const { error } = await supabase
        .from('community_posts')
        .update({
          title: newPost.title,
          description: newPost.description,
          content: newPost.content,
          category: newPost.category,
          file_url: fileUrl,
          file_type: fileType,
          file_name: fileName,
          image_url: imageUrl
        })
        .eq('id', editingPost.id);

      if (error) throw error;

      await loadPosts();
      
      setEditingPost(null);
      setNewPost({ title: '', description: '', content: '', category: 'General', file: null });
      setIsCreatePostOpen(false);
      toast.success('Post updated successfully!');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(posts.filter(post => post.id !== postId));
      toast.success('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleLikePost = async (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const newLikes = post.isLiked ? post.likes - 1 : post.likes + 1;

    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ likes: newLikes })
        .eq('id', postId);

      if (error) throw error;

      setPosts(posts.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              isLiked: !p.isLiked, 
              likes: newLikes
            }
          : p
      ));
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const handleDownloadFile = async (post: Post) => {
    if (!post.fileUrl) return;

    try {
      // Increment download counter in DB
      const { error } = await supabase
        .from('community_posts')
        .update({ downloads: post.downloads + 1 })
        .eq('id', post.id);

      if (error) throw error;

      // Fetch file as blob
      const response = await fetch(post.fileUrl);
      const blob = await response.blob();

      // Create object URL
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = post.fileName || 'download'; 
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Update state so UI refreshes
      setPosts(posts.map(p =>
        p.id === post.id ? { ...p, downloads: p.downloads + 1 } : p
      ));

      toast.success('Download started!');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'video/mp4', 'image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PDF, MP4, and image files are allowed');
        return;
      }

      setNewPost({ ...newPost, file });
      toast.success('File attached successfully!');
    }
  };

  const AddCommentForm = ({ postId }: { postId: number }) => {
    const [comment, setComment] = useState('');

    const handleAddComment = async () => {
      if (!comment.trim()) return;

      try {
        // Get current user
        const user = await getCurrentUser();
        
        if (!user) {
          toast.error('You must be logged in to comment');
          return;
        }

        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, avatar_url, level')
          .eq('id', user.id)
          .single();

        const { error } = await supabase
          .from('community_comments')
          .insert([
            {
              post_id: postId,
              content: comment,
              author_name: profile?.name || user.email?.split('@')[0] || 'Anonymous',
              author_avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
              author_level: profile?.level || 1,
              likes: 0
            }
          ]);

        if (error) throw error;

        await loadPosts();
        setComment('');
        toast.success('Comment added!');
      } catch (error) {
        console.error('Error adding comment:', error);
        toast.error('Failed to add comment');
      }
    };

    return (
      <div className="flex items-center gap-2 mt-4">
        <Avatar className="w-8 h-8">
          <AvatarFallback>YU</AvatarFallback>
        </Avatar>
        <Input
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          className="flex-1"
        />
        <Button size="sm" onClick={handleAddComment} disabled={!comment.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const PostCard = ({ post }: { post: Post }) => {
    const isExpanded = expandedComments.has(post.id);
    const isOwner = currentUserId && post.user_id && (currentUserId === post.user_id);
    
    // Debug logging
    console.log('PostCard render:', {
      postId: post.id,
      postTitle: post.title,
      currentUserId: currentUserId,
      postUserId: post.user_id,
      isOwner: isOwner,
      bothExist: !!(currentUserId && post.user_id),
      matches: currentUserId === post.user_id
    });

    return (
      <Card className="overflow-hidden">
        {/* Media Content */}
        {post.image && (
          <div className="aspect-video relative overflow-hidden">
            <ImageWithFallback
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2">
              <Badge variant="secondary">{post.category}</Badge>
            </div>
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{post.rating}</span>
            </div>
          </div>
        )}

        {/* File Attachment */}
        {post.fileUrl && post.fileType && (
          <div className="p-4 bg-muted/50 border-b">
            <div className="flex items-center gap-3">
              {post.fileType === 'pdf' && <FileText className="w-5 h-5 text-red-500" />}
              {post.fileType === 'mp4' && <Play className="w-5 h-5 text-blue-500" />}
              {post.fileType === 'image' && <Camera className="w-5 h-5 text-green-500" />}
              <div className="flex-1">
                <p className="font-medium text-sm">{post.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {post.fileType.toUpperCase()} • {post.downloads} downloads
                </p>
              </div>
              <Button size="sm" variant="outline" className="gap-1" onClick={() => handleDownloadFile(post)}>
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
        )}
        
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{post.author.name}</span>
                <Badge variant="outline" className="text-xs">
                  <Award className="w-3 h-3 mr-1" />
                  Lvl {post.author.level}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">{post.author.badge}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
                    onClick={() => console.log('Dropdown clicked for post:', post.id)}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isOwner ? (
                    <>
                      <DropdownMenuItem onClick={() => {
                        console.log('Edit clicked');
                        handleEditPost(post);
                      }}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Post
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.log('Share clicked')}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => {
                          console.log('Delete clicked');
                          handleDeletePost(post.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={() => console.log('Share clicked (non-owner)')}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <CardTitle className="text-base">{post.title}</CardTitle>
          <CardDescription>{post.description}</CardDescription>
          {post.content && (
            <p className="text-sm text-muted-foreground mt-2">{post.content}</p>
          )}
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.views} views
            </span>
            {post.downloads > 0 && (
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {post.downloads} downloads
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`gap-1 ${post.isLiked ? 'text-red-500' : ''}`}
                onClick={() => handleLikePost(post.id)}
              >
                <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                {post.likes}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1"
                onClick={() => {
                  const newExpanded = new Set(expandedComments);
                  if (isExpanded) {
                    newExpanded.delete(post.id);
                  } else {
                    newExpanded.add(post.id);
                  }
                  setExpandedComments(newExpanded);
                }}
              >
                <MessageCircle className="w-4 h-4" />
                {post.comments.length}
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          {isExpanded && (
            <div className="space-y-4 border-t pt-4">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.author.name}</span>
                        <Badge variant="outline" className="text-xs">
                          Lvl {comment.author.level}
                        </Badge>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{comment.timeAgo}</span>
                      <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                        <Heart className="w-3 h-3 mr-1" />
                        {comment.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                        <Reply className="w-3 h-3 mr-1" />
                        Reply
                      </Button>
                    </div>
                    
                    {/* Replies */}
                    {comment.replies && comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3 mt-3 ml-4">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={reply.author.avatar} />
                          <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-muted/50 rounded-lg p-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-xs">{reply.author.name}</span>
                              <Badge variant="outline" className="text-xs">
                                Lvl {reply.author.level}
                              </Badge>
                            </div>
                            <p className="text-xs">{reply.content}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{reply.timeAgo}</span>
                            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                              <Heart className="w-3 h-3 mr-1" />
                              {reply.likes}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <AddCommentForm postId={post.id} />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            Community Exchange
          </h2>
          <p className="text-muted-foreground">Share knowledge and learn from others</p>
        </div>
        
        <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="w-4 h-4" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
              <DialogDescription>
                {editingPost ? 'Edit your community post details and content.' : 'Share your knowledge with the LifeCraft community.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Enter post title..."
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newPost.description}
                  onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                  placeholder="Brief description of your post..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="content">Content (Optional)</Label>
                <Textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Detailed content, instructions, or notes..."
                  rows={5}
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <select 
                  id="category"
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="General">General</option>
                  <option value="Energy">Energy</option>
                  <option value="Water">Water</option>
                  <option value="Food Production">Food Production</option>
                  <option value="Waste Management">Waste Management</option>
                  <option value="Survival Skills">Survival Skills</option>
                  <option value="Repairs">Repairs</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Navigation">Navigation</option>
                </select>
              </div>
              
              <div>
                <Label>Attach File (Optional)</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleFileSelect}
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Choose File
                  </Button>
                  {newPost.file && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{newPost.file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setNewPost({ ...newPost, file: null })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Supported: PDF, MP4, Images (max 10MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept=".pdf,.mp4,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileChange}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={editingPost ? handleUpdatePost : handleCreatePost}
                  className="flex-1"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingPost ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingPost ? 'Update Post' : 'Create Post'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsCreatePostOpen(false);
                    setEditingPost(null);
                    setNewPost({ title: '', description: '', content: '', category: 'General', file: null });
                  }}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to share something with the community!</p>
            <Button onClick={() => setIsCreatePostOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}