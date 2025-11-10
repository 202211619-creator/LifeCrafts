import React, { useState, useEffect } from 'react';
import { 
  Download, 
  CheckCircle, 
  Package,
  FileText,
  Loader2
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { supabase } from '../utils/supabase/client';

interface DownloadPack {
  id: string;
  title: string;
  description: string;
  size: string;
  items: number;
  categories: string[];
  priority: string;
  image: string;
  pdf_url?: string;
  created_at?: string;
}

export function OfflineManager() {
  const [downloadPacks, setDownloadPacks] = useState<DownloadPack[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<{[key: string]: number}>({});
  const [isDownloading, setIsDownloading] = useState<{[key: string]: boolean}>({});
  const [downloadedPacks, setDownloadedPacks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDownloadPacks();
    loadDownloadedPacks();
  }, []);

  const fetchDownloadPacks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('download_packs')
        .select('*')
        .order('priority', { ascending: false });

      if (error) throw error;

      if (data) {
        setDownloadPacks(data);
      }
    } catch (error) {
      console.error('Error fetching download packs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDownloadedPacks = () => {
    const downloaded = localStorage.getItem('downloaded_packs');
    if (downloaded) {
      setDownloadedPacks(new Set(JSON.parse(downloaded)));
    }
  };

  const saveDownloadedPack = (packId: string) => {
    const updated = new Set(downloadedPacks);
    updated.add(packId);
    setDownloadedPacks(updated);
    localStorage.setItem('downloaded_packs', JSON.stringify(Array.from(updated)));
  };

  const handleDownload = async (pack: DownloadPack) => {
    if (!pack.pdf_url) {
      alert('PDF URL not available for this pack');
      return;
    }

    setIsDownloading(prev => ({ ...prev, [pack.id]: true }));
    setDownloadProgress(prev => ({ ...prev, [pack.id]: 0 }));

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          const current = prev[pack.id] || 0;
          if (current >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [pack.id]: current + 10 };
        });
      }, 200);

      // Fetch the PDF from Supabase Storage
      const response = await fetch(pack.pdf_url);
      const blob = await response.blob();

      clearInterval(progressInterval);
      setDownloadProgress(prev => ({ ...prev, [pack.id]: 100 }));

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pack.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Mark as downloaded
      saveDownloadedPack(pack.id);

      // Log download to database
      await supabase.from('download_logs').insert({
        pack_id: pack.id,
        pack_title: pack.title,
        downloaded_at: new Date().toISOString()
      });

      setTimeout(() => {
        setIsDownloading(prev => ({ ...prev, [pack.id]: false }));
        setDownloadProgress(prev => ({ ...prev, [pack.id]: 0 }));
      }, 1000);
    } catch (error) {
      console.error('Error downloading pack:', error);
      alert('Failed to download pack. Please try again.');
      setIsDownloading(prev => ({ ...prev, [pack.id]: false }));
      setDownloadProgress(prev => ({ ...prev, [pack.id]: 0 }));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Offline Content Manager</h2>
        <p className="text-muted-foreground">Download survival guide packs as PDFs for offline access</p>
      </div>

      <div className="grid gap-6">
        {downloadPacks.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No download packs available</h3>
            <p className="text-muted-foreground">Check back later for new content</p>
          </Card>
        ) : (
          downloadPacks.map((pack) => (
            <Card key={pack.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-48 lg:w-56 h-48 md:h-auto flex-shrink-0">
                  <ImageWithFallback
                    src={pack.image}
                    alt={pack.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 p-4 md:p-6">
                  <div className="flex items-start justify-between mb-2 gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-lg mb-1">{pack.title}</h4>
                      <p className="text-sm text-muted-foreground">{pack.description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={getPriorityColor(pack.priority) as any}>
                        {pack.priority}
                      </Badge>
                      {downloadedPacks.has(pack.id) && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>{pack.size}</span>
                    <span>•</span>
                    <span>{pack.items} items</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pack.categories.slice(0, 4).map((category, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                    {pack.categories.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{pack.categories.length - 4} more
                      </Badge>
                    )}
                  </div>

                  {isDownloading[pack.id] ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Downloading PDF...</span>
                        <span>{Math.round(downloadProgress[pack.id] || 0)}%</span>
                      </div>
                      <Progress value={downloadProgress[pack.id] || 0} className="h-2" />
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleDownload(pack)}
                      disabled={!pack.pdf_url}
                      className="w-full sm:w-auto min-w-[150px]"
                    >
                      {downloadedPacks.has(pack.id) ? (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Download Again
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}