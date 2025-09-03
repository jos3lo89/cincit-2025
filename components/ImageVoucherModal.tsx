"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ExternalLink, Eye, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

type ImageVoucherModalProps = {
  imageUrl: string | null;
  onClose: () => void;
  title?: string;
};

export const ImageVoucherModal = ({
  imageUrl,
  onClose,
  title = "Imagen del Voucher",
}: ImageVoucherModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      setIsLoading(true);
    }
  }, [imageUrl]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={!!imageUrl} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="relative flex items-center justify-center min-h-[200px]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Voucher completo"
              height={650}
              width={450}
              className={`w-auto h-auto rounded-lg transition-opacity duration-300 ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          )}
        </div>
        <DialogFooter>
          {imageUrl && (
            <Button asChild size="sm" variant="default">
              <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir en nueva pestaña
              </a>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
