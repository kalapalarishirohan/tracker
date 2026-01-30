import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, Loader2, RefreshCw } from 'lucide-react';

interface EmbeddedViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

export default function EmbeddedViewer({ url, title, onClose }: EmbeddedViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setError(false);
    const iframe = document.querySelector('#embedded-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = url;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium text-white">{title}</h2>
          <span className="text-xs text-zinc-500 truncate max-w-md">{url}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="text-zinc-400 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(url, '_blank')}
            className="text-zinc-400 hover:text-white"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        )}
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 gap-4">
            <p className="text-zinc-400">Unable to load this content in the embedded viewer.</p>
            <p className="text-xs text-zinc-600">Some websites block embedding. Try opening externally.</p>
            <Button onClick={() => window.open(url, '_blank')} variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in New Tab
            </Button>
          </div>
        ) : (
          <iframe
            id="embedded-iframe"
            src={url}
            className="w-full h-full border-0"
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        )}
      </div>
    </div>
  );
}
