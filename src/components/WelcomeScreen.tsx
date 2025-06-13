
import React from 'react';
import { Camera, Upload } from 'lucide-react';

interface WelcomeScreenProps {
  onScanMenu: () => void;
  onUploadMenu: () => void;
}

const WelcomeScreen = ({ onScanMenu, onUploadMenu }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-warm flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-8 px-6 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-gold rounded-2xl flex items-center justify-center shadow-lg">
          <Camera className="w-10 h-10 text-white" />
        </div>
        <h1 className="font-display text-4xl font-bold text-restaurant-dark-brown mb-3">
          MenuVision
        </h1>
        <p className="text-restaurant-warm-gray text-lg font-medium">
          Transform text menus into visual feasts
        </p>
      </div>

      {/* Hero Section */}
      <div className="flex-1 px-6 flex flex-col justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-semibold text-restaurant-dark-brown mb-4">
              See Your Food Before You Order
            </h2>
            <p className="text-restaurant-warm-gray leading-relaxed">
              Scan any text-based menu and watch as AI creates beautiful, realistic images of every dish to help you make the perfect choice.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={onScanMenu}
              className="w-full btn-primary flex items-center justify-center space-x-3 py-4 text-lg"
            >
              <Camera className="w-6 h-6" />
              <span>Scan Menu with Camera</span>
            </button>

            <button
              onClick={onUploadMenu}
              className="w-full btn-secondary flex items-center justify-center space-x-3 py-4 text-lg"
            >
              <Upload className="w-6 h-6" />
              <span>Upload Menu Photo</span>
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "📸", title: "Smart Scan", desc: "AI-powered menu recognition" },
            { icon: "🎨", title: "Visual Menu", desc: "Realistic dish images" },
            { icon: "⚡", title: "Instant Results", desc: "Fast processing" }
          ].map((feature, index) => (
            <div key={index} className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-restaurant-dark-brown text-sm mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-restaurant-warm-gray">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
