import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { X, Camera } from 'lucide-react';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function QRScannerComponent({ onScan, onClose, isOpen }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      setScanning(true);
      
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          onScan(result.data);
          onClose();
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      scannerRef.current.start().catch((error) => {
        console.error('Scanner start error:', error);
        setHasCamera(false);
        setScanning(false);
      });

      return () => {
        if (scannerRef.current) {
          scannerRef.current.stop();
          scannerRef.current.destroy();
          scannerRef.current = null;
        }
        setScanning(false);
      };
    }
  }, [isOpen, onScan, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="relative w-full h-full max-w-md max-h-md">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">Scan QR Code</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30"
            type="button"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="relative w-full h-full flex items-center justify-center">
          {hasCamera ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover rounded-lg"
              playsInline
              muted
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-white p-8">
              <Camera size={64} className="mb-4 opacity-50" />
              <p className="text-center">Camera access denied or not available</p>
              <p className="text-sm text-gray-300 text-center mt-2">
                Please enable camera permissions to scan QR codes
              </p>
            </div>
          )}

          {scanning && (
            <div className="absolute inset-0 border-2 border-white rounded-lg">
              <div className="absolute inset-4 border border-white/50 rounded-lg">
                <div className="w-6 h-6 border-t-2 border-l-2 border-white absolute top-0 left-0"></div>
                <div className="w-6 h-6 border-t-2 border-r-2 border-white absolute top-0 right-0"></div>
                <div className="w-6 h-6 border-b-2 border-l-2 border-white absolute bottom-0 left-0"></div>
                <div className="w-6 h-6 border-b-2 border-r-2 border-white absolute bottom-0 right-0"></div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <p className="text-white text-sm">
            Point your camera at a QR code to scan
          </p>
        </div>
      </div>
    </div>
  );
}