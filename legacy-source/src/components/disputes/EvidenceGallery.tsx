"use client";

import { useState } from "react";
import { Evidence } from "@/data/mock/disputes";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Image as ImageIcon, Video, Mic, Paperclip, Download } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EvidenceGalleryProps {
  evidence: Evidence[];
}

export function EvidenceGallery({ evidence }: EvidenceGalleryProps) {
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);

  const getIcon = (type: Evidence["type"]) => {
    switch (type) {
      case "image": return <ImageIcon className="h-8 w-8 text-blue-500" />;
      case "video": return <Video className="h-8 w-8 text-red-500" />;
      case "document": return <FileText className="h-8 w-8 text-orange-500" />;
      default: return <Paperclip className="h-8 w-8 text-gray-500" />;
    }
  };

  if (!evidence || evidence.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted-foreground border-2 border-dashed rounded-lg">
        <Paperclip className="h-10 w-10 mb-2 opacity-50" />
        <p>No evidence uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {evidence.map((item) => (
        <Dialog key={item.id}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors group relative overflow-hidden">
              <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                 {item.type === 'image' && item.url !== '#' ? (
                    <div className="relative w-full h-24 rounded-md overflow-hidden bg-muted">
                        <Image 
                            src={item.url} 
                            alt={item.name} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform"
                        />
                    </div>
                 ) : (
                    <div className="w-full h-24 rounded-md bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                        {getIcon(item.type)}
                    </div>
                 )}
                
                <div className="w-full">
                  <p className="font-medium text-sm truncate" title={item.name}>{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.size} • {new Date(item.uploadedAt).toLocaleDateString()}</p>
                </div>
                 <Badge variant="secondary" className="absolute top-2 right-2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.uploadedBy}
                 </Badge>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-3xl w-full">
             <DialogTitle>{item.name}</DialogTitle>
             <DialogDescription>
                Uploaded by {item.uploadedBy} on {new Date(item.uploadedAt).toLocaleString()}
             </DialogDescription>
            <div className="flex flex-col items-center justify-center min-h-[300px] bg-muted/20 rounded-lg p-4">
              {item.type === "image" ? (
                <div className="relative w-full h-[500px]">
                  <Image src={item.url} alt={item.name} fill className="object-contain" />
                </div>
              ) : item.type === "video" ? (
                <div className="flex flex-col items-center">
                    <Video className="h-24 w-24 text-muted-foreground mb-4" />
                    <p>Video preview not available in mock mode.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                    <FileText className="h-24 w-24 text-muted-foreground mb-4" />
                    <p>Document preview.</p>
                </div>
              )}
              <div className="mt-4 flex gap-2">
                 <Button variant="outline" onClick={() => window.open(item.url, '_blank')}>
                    <Download className="mr-2 h-4 w-4" /> Download
                 </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
