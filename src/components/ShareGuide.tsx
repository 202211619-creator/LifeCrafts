import React, { useState } from 'react';
import { 
  FileText, 
  Video, 
  Download, 
  Eye, 
  ExternalLink,
  Smartphone,
  Monitor,
  Play,
  BookOpen,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';

const sampleContent = [
  {
    id: 1,
    title: 'Emergency First Aid Basics',
    type: 'pdf',
    size: '2.4 MB',
    description: 'Complete guide covering basic first aid techniques, wound care, and emergency procedures.',
    downloadUrl: '/guides/emergency-first-aid.pdf',
    previewUrl: '/guides/emergency-first-aid.pdf',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
    category: 'Medical',
    duration: null,
    pages: 24
  },
  {
    id: 2,
    title: 'Solar Panel Installation',
    type: 'video',
    size: '45.2 MB',
    description: 'Step-by-step video tutorial on installing solar panels for off-grid energy systems.',
    downloadUrl: '/videos/solar-installation.mp4',
    previewUrl: '/videos/solar-installation.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400',
    category: 'Energy',
    duration: '12:45',
    pages: null
  },
  {
    id: 3,
    title: 'Water Purification Methods',
    type: 'pdf',
    size: '3.1 MB',
    description: 'Comprehensive guide to various water purification techniques for survival situations.',
    downloadUrl: '/guides/water-purification.pdf',
    previewUrl: '/guides/water-purification.pdf',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    category: 'Survival',
    duration: null,
    pages: 18
  },
  {
    id: 4,
    title: 'Building a Shelter',
    type: 'video',
    size: '38.7 MB',
    description: 'Learn how to construct emergency shelters using natural and basic materials.',
    downloadUrl: '/videos/shelter-building.mp4',
    previewUrl: '/videos/shelter-building.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    category: 'Survival',
    duration: '18:32',
    pages: null
  }
];

function FileTypeGuide() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Share2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3>How to View Content</h3>
        <p className="text-muted-foreground">
          LifeCraft offers two types of content files with different viewing options
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* PDF Guide */}
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              PDF Articles
              <Badge variant="outline">PDF</Badge>
            </CardTitle>
            <CardDescription>
              Guides, manuals, and reference materials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">View in Browser</p>
                  <p className="text-sm text-muted-foreground">
                    Click "Preview" to read directly in your browser without downloading
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Download className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Download for Offline</p>
                  <p className="text-sm text-muted-foreground">
                    Save to device for offline reading
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <p className="font-medium mb-2">Open Downloaded PDFs with:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-muted-foreground" />
                  <span>Browser PDF viewer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-muted-foreground" />
                  <span>Adobe Acrobat</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                  <span>Mobile PDF apps</span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-muted-foreground" />
                  <span>PDF readers</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Guide */}
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              Video Tutorials
              <Badge variant="outline">MP4</Badge>
            </CardTitle>
            <CardDescription>
              Step-by-step visual demonstrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Play className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Stream Online</p>
                  <p className="text-sm text-muted-foreground">
                    Watch directly in the app with internet connection
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Download className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Download for Offline</p>
                  <p className="text-sm text-muted-foreground">
                    Save to device for offline viewing
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <p className="font-medium mb-2">Open Downloaded Videos with:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-muted-foreground" />
                  <span>VLC Media Player</span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-muted-foreground" />
                  <span>Windows Media Player</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                  <span>Phone video player</span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-muted-foreground" />
                  <span>QuickTime</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Pro Tip</p>
              <p className="text-sm text-muted-foreground">
                For emergency preparedness, download essential guides before you need them. 
                PDFs work great offline, and videos can be crucial when you need visual instructions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ContentBrowser() {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handlePreview = (item: any) => {
    if (item.type === 'pdf') {
      // Open PDF in new tab for preview
      window.open(item.previewUrl, '_blank');
      toast.success('Opening PDF preview in new tab');
    } else {
      // For video, you could open a modal or navigate to video player
      toast.info('Video preview would open in media player');
    }
  };

  const handleDownload = (item: any) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = item.downloadUrl;
    link.download = `${item.title}.${item.type === 'pdf' ? 'pdf' : 'mp4'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${item.title} downloaded successfully!`);
  };

  const handleShare = async (item: any) => {
    const shareUrl = `${window.location.origin}/share/${item.id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedId(item.id);
      toast.success('Share link copied to clipboard!');
      
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error('Failed to copy share link');
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'pdf' ? FileText : Video;
  };

  const getTypeBadge = (type: string) => {
    return type === 'pdf' ? 
      <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200">PDF</Badge> :
      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200">MP4</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3>Browse Content</h3>
        <p className="text-muted-foreground">
          Try viewing and downloading different types of content
        </p>
      </div>

      <div className="grid gap-6">
        {sampleContent.map((item) => {
          const TypeIcon = getTypeIcon(item.type);
          
          return (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-48 h-32 md:h-auto flex-shrink-0">
                  <ImageWithFallback
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <TypeIcon className="w-5 h-5 text-muted-foreground" />
                        <h4 className="font-medium">{item.title}</h4>
                        {getTypeBadge(item.type)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span>{item.size}</span>
                    <span>•</span>
                    <span>{item.category}</span>
                    {item.duration && (
                      <>
                        <span>•</span>
                        <span>{item.duration}</span>
                      </>
                    )}
                    {item.pages && (
                      <>
                        <span>•</span>
                        <span>{item.pages} pages</span>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {item.type === 'pdf' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePreview(item)}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Preview in Browser
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      onClick={() => handleDownload(item)}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleShare(item)}
                      className="gap-2"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function ShareGuide() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Share2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2>Content Sharing & Viewing Guide</h2>
        <p className="text-muted-foreground">
          Learn how to view and share different types of content in LifeCraft
        </p>
      </div>

      <Tabs defaultValue="guide" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="guide">How to View Files</TabsTrigger>
          <TabsTrigger value="content">Try It Out</TabsTrigger>
        </TabsList>

        <TabsContent value="guide" className="mt-6">
          <FileTypeGuide />
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <ContentBrowser />
        </TabsContent>
      </Tabs>
    </div>
  );
}