
import React, { useRef, useState } from 'react';
import { Camera, Upload, ArrowDown, Grid2x2 } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onBack: () => void;
}

const CameraCapture = ({ onCapture, onBack }: CameraCaptureProps) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    // Simulate camera capture with a placeholder
    const placeholderImage = "data:image/svg+xml;base64," + btoa(`
      <svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f8f9fa"/>
        <rect x="50" y="50" width="300" height="500" fill="white" stroke="#e9ecef" stroke-width="2"/>
        <text x="200" y="100" text-anchor="middle" font-family="serif" font-size="18" font-weight="bold">RESTAURANT MENU</text>
        <line x1="50" y1="120" x2="350" y2="120" stroke="#dee2e6" stroke-width="1"/>
        
        <text x="70" y="160" font-family="serif" font-size="14" font-weight="bold">APPETIZERS</text>
        <text x="70" y="180" font-family="sans-serif" font-size="12">Caesar Salad - $12</text>
        <text x="70" y="195" font-family="sans-serif" font-size="10" fill="#666">Crisp romaine, parmesan, croutons</text>
        
        <text x="70" y="220" font-family="sans-serif" font-size="12">Bruschetta - $10</text>
        <text x="70" y="235" font-family="sans-serif" font-size="10" fill="#666">Tomato, basil, garlic, balsamic</text>
        
        <text x="70" y="270" font-family="serif" font-size="14" font-weight="bold">MAIN COURSES</text>
        <text x="70" y="290" font-family="sans-serif" font-size="12">Grilled Salmon - $24</text>
        <text x="70" y="305" font-family="sans-serif" font-size="10" fill="#666">Herb-crusted, lemon butter, vegetables</text>
        
        <text x="70" y="330" font-family="sans-serif" font-size="12">Ribeye Steak - $32</text>
        <text x="70" y="345" font-family="sans-serif" font-size="10" fill="#666">12oz, garlic mashed potatoes, asparagus</text>
        
        <text x="70" y="370" font-family="sans-serif" font-size="12">Chicken Parmesan - $18</text>
        <text x="70" y="385" font-family="sans-serif" font-size="10" fill="#666">Breaded cutlet, mozzarella, marinara, pasta</text>
      </svg>
    `);
    setCapturedImage(placeholderImage);
  };

  const handleUseImage = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <button
          onClick={onBack}
          className="text-white p-2 rounded-full bg-black/30 backdrop-blur-sm"
        >
          ←
        </button>
        <h2 className="text-white font-semibold">Capture Menu</h2>
        <div className="w-10"></div>
      </div>

      {capturedImage ? (
        /* Preview Mode */
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 flex items-center justify-center p-4 pt-20">
            <div className="relative max-w-sm w-full">
              <img
                src={capturedImage}
                alt="Captured menu"
                className="w-full rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-t-3xl space-y-4">
            <div className="text-center">
              <h3 className="font-display text-xl font-semibold text-restaurant-dark-brown mb-2">
                Perfect! Menu Captured
              </h3>
              <p className="text-restaurant-warm-gray text-sm">
                Ready to process your menu and generate dish images
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleUseImage}
                className="w-full btn-primary py-4 text-lg"
              >
                Process Menu
              </button>
              <button
                onClick={() => setCapturedImage(null)}
                className="w-full btn-secondary py-3"
              >
                Retake Photo
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Camera Mode */
        <div className="min-h-screen flex flex-col">
          {/* Camera Viewfinder */}
          <div className="flex-1 relative bg-gray-800 camera-overlay">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Menu Frame Guide */}
                <div className="w-80 h-96 border-4 border-white border-dashed rounded-3xl relative bg-black/20 backdrop-blur-sm">
                  <div className="absolute inset-4 border-2 border-white/50 rounded-2xl flex flex-col items-center justify-center text-white/70">
                    <Grid2x2 className="w-12 h-12 mb-4" />
                    <p className="text-center text-sm font-medium">
                      Position menu within this frame
                    </p>
                    <p className="text-center text-xs mt-2">
                      Ensure text is clear and readable
                    </p>
                  </div>
                  
                  {/* Corner guides */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 border-l-4 border-t-4 border-restaurant-gold rounded-tl-lg"></div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 border-r-4 border-t-4 border-restaurant-gold rounded-tr-lg"></div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-4 border-b-4 border-restaurant-gold rounded-bl-lg"></div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-4 border-b-4 border-restaurant-gold rounded-br-lg"></div>
                </div>

                {/* Tips */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-white text-center">
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                    <span>Hold steady for best results</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 bg-black/80 backdrop-blur-md">
            <div className="flex items-center justify-center space-x-8">
              <button
                onClick={triggerFileInput}
                className="p-4 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <Upload className="w-6 h-6" />
              </button>

              <button
                onClick={handleCapture}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform active:scale-95"
              >
                <div className="w-16 h-16 bg-restaurant-gold rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </button>

              <div className="w-12 h-12"></div>
            </div>

            <div className="text-center mt-4">
              <p className="text-white/70 text-sm">
                Tap the camera button or upload from gallery
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default CameraCapture;
