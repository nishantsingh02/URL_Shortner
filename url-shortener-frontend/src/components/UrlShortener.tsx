import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Link, Check, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShortenedUrl {
  originalUrl: string;
  shortUrl: string;
  id: string;
  clicks?: number;
  createdAt?: string;
}

interface ApiResponse {
  success: boolean;
  data?: ShortenedUrl;
  error?: string;
  id: string
}

const UrlShortener = () => {
  const [url, setUrl] = useState("");
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleShorten = async () => {
    if (!url) {
      toast({
        title: "Please enter a URL",
        description: "You need to provide a URL to shorten.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (e.g., https://example.com)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    

    try {
      const response = await fetch('https://url-shortner-backend-phi-seven.vercel.app/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const result: ApiResponse = await response.json();

      if (result.id) {
        
        const newShort: ShortenedUrl = {
          originalUrl: url,
          shortUrl: result.id,
          id: result.id,
          clicks: 0,
          createdAt: new Date().toISOString(),
        };

        setShortenedUrls(prev => [newShort, ...prev]);
        setUrl("");

        toast({
          title: "URL shortened successfully!",
          description: "Your shortened URL is ready to use.",
        });
      } else {
        throw new Error(result.error || 'Failed to shorten URL');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to shorten URL",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const copyToClipboard = async (shortUrl: string, id: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast({
        title: "Copied!",
        description: "Short URL copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Unable to copy URL to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Main shortening form */}
      <Card className="shadow-elegant">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl bg-gradient-primary bg-clip-text text-transparent">
            Shorten Your URLs
          </CardTitle>
          <CardDescription className="text-lg">
            Transform long URLs into short, shareable links in seconds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Enter your URL here (e.g., https://example.com/very-long-url)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleShorten()}
              className="flex-1"
            />
            <Button 
              onClick={handleShorten} 
              disabled={isLoading}
              variant="hero"
              size="lg"
              className="sm:w-auto w-full"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Link className="w-4 h-4" />
              )}
              {isLoading ? "Shortening..." : "Shorten URL"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {shortenedUrls.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Your Shortened URLs</h2>
          <div className="space-y-3">
            {shortenedUrls.map((item) => (
              <Card key={item.id} className="shadow-sm hover:shadow-md transition-smooth">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Original URL:</p>
                      <p className="text-sm break-all bg-muted p-2 rounded">{item.originalUrl}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Shortened URL:</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-primary/5 text-primary px-3 py-2 rounded font-mono text-sm">
                          {item.shortUrl}
                        </code>
                        <Button
                          onClick={() => copyToClipboard(item.shortUrl, item.id)}
                          variant="outline"
                          size="sm"
                          className="shrink-0"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-4 h-4 text-success" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Analytics Section */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" />
                          <span>{item.clicks || 0} clicks</span>
                        </div>
                        {item.createdAt && (
                          <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <Card className="text-center shadow-sm hover:shadow-md transition-smooth">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <Link className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Fast & Reliable</h3>
            <p className="text-sm text-muted-foreground">
              Instantly shorten your URLs with our lightning-fast service
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center shadow-sm hover:shadow-md transition-smooth">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Analytics Ready</h3>
            <p className="text-sm text-muted-foreground">
              Track clicks and analyze performance of your shortened links
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center shadow-sm hover:shadow-md transition-smooth">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <Copy className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Easy Sharing</h3>
            <p className="text-sm text-muted-foreground">
              Copy and share your shortened URLs with a single click
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UrlShortener;
