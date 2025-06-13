import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, ImageIcon } from 'lucide-react';
import { parseMenuText } from '../utils/menuProcessing';

interface MenuProcessingProps {
  menuImage: string;
  extractedText?: string;
  sessionId: string;
  onTextExtracted?: (text: string) => void;
  onProcessingComplete: (dishes: Dish[]) => void;
}

interface Dish {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  ingredients: string[];
}

const MenuProcessing = ({ 
  menuImage, 
  extractedText, 
  sessionId,
  onTextExtracted, 
  onProcessingComplete 
}: MenuProcessingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [menuText, setMenuText] = useState('');
  const [showTextPreview, setShowTextPreview] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<number>(0);
  const [totalDishes, setTotalDishes] = useState<number>(0);

  const steps = [
    { title: "Scanning Menu", desc: "Reading text from your photo with OCR" },
    { title: "Analyzing Content", desc: "Detecting cuisine type and menu sections" },
    { title: "Processing Dishes", desc: "Extracting dish names, descriptions, and prices" },
    { title: "Generating Images", desc: "Creating contextual dish photos with AI" },
    { title: "Finalizing Menu", desc: "Organizing your enhanced visual menu" }
  ];

  useEffect(() => {
    console.log('MenuProcessing started with sessionId:', sessionId);
    
    // If we already have extracted text, skip to processing
    if (extractedText) {
      setMenuText(extractedText);
      setShowTextPreview(true);
      setCurrentStep(2);
      setProgress(60);
      
      // Process dishes immediately
      setTimeout(() => {
        processMenu(extractedText);
      }, 1000);
      return;
    }

    // Otherwise start from OCR
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        
        const newProgress = prev + 2;
        const stepIndex = Math.floor(newProgress / 20);
        setCurrentStep(Math.min(stepIndex, steps.length - 1));
        
        // Show text preview at 40% progress
        if (newProgress >= 40 && !showTextPreview) {
          const mockMenuText = `
APPETIZERS
Caesar Salad - Crisp romaine lettuce, parmesan cheese, croutons, house caesar dressing $12
Bruschetta - Grilled bread topped with diced tomatoes, fresh basil, garlic, balsamic glaze $10
Calamari Rings - Fresh squid rings, lightly battered and fried, served with marinara sauce $14

MAIN COURSES  
Grilled Atlantic Salmon - Herb-crusted salmon fillet with lemon butter sauce and seasonal vegetables $24
Prime Ribeye Steak - 12oz prime ribeye with garlic mashed potatoes and grilled asparagus $32
Chicken Parmesan - Breaded chicken cutlet with mozzarella cheese, marinara sauce, served with pasta $18
Lobster Risotto - Creamy arborio rice with fresh lobster meat, white wine, and parmesan $28

DESSERTS
Chocolate Lava Cake - Warm chocolate cake with molten center, vanilla ice cream $8
Tiramisu - Classic Italian dessert with mascarpone, espresso, and ladyfingers $7
          `;
          setMenuText(mockMenuText);
          setShowTextPreview(true);
          
          if (onTextExtracted) {
            onTextExtracted(mockMenuText);
          }
        }
        
        // Start processing at 80%
        if (newProgress >= 80) {
          processMenu(menuText);
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [extractedText, sessionId, menuText, showTextPreview, onTextExtracted]);

  const processMenu = (text: string) => {
    if (!text.trim()) return;
    
    console.log('Processing menu with text:', text);
    setCurrentStep(4);
    
    // Parse menu and generate images
    const processedDishes = parseMenuText(text, sessionId);
    setTotalDishes(processedDishes.length);
    
    console.log('Processed dishes:', processedDishes);
    
    // Simulate image generation progress
    let imageCount = 0;
    const imageTimer = setInterval(() => {
      imageCount++;
      setGeneratedImages(imageCount);
      
      if (imageCount >= processedDishes.length) {
        clearInterval(imageTimer);
        setTimeout(() => {
          console.log('Processing complete, calling onProcessingComplete');
          onProcessingComplete(processedDishes);
        }, 1000);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-6 px-6 text-center">
        <h1 className="font-display text-2xl font-bold text-restaurant-dark-brown mb-2">
          Processing Your Menu
        </h1>
        <p className="text-restaurant-warm-gray">
          Enhanced AI analysis in progress
        </p>
      </div>

      {/* Menu Preview */}
      <div className="px-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative">
          <img
            src={menuImage}
            alt="Menu being processed"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-restaurant-gold/20 to-transparent rounded-2xl"></div>
          {currentStep >= 1 && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Text Extracted
            </div>
          )}
        </div>
      </div>

      {/* OCR Text Preview */}
      {showTextPreview && (
        <div className="px-6 mb-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h3 className="font-display text-lg font-semibold text-restaurant-dark-brown">
                Extracted Menu Text
              </h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {menuText.trim()}
              </pre>
            </div>
            <p className="text-xs text-restaurant-warm-gray mt-2">
              ✓ Cuisine detected • ✓ Categories identified • ✓ Enhanced prompts ready
            </p>
          </div>
        </div>
      )}

      {/* Progress Section */}
      <div className="flex-1 px-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-restaurant-warm-gray">Progress</span>
              <span className="text-sm font-bold text-restaurant-gold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-restaurant-gold to-restaurant-gold-light h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Image Generation Progress */}
          {currentStep === 4 && totalDishes > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <span className="text-blue-700 font-medium">Generating Images</span>
              </div>
              <div className="text-sm text-blue-600">
                {generatedImages} of {totalDishes} images generated
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(generatedImages / totalDishes) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Current Step */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-gold rounded-full flex items-center justify-center animate-scale-in">
              <Clock className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="font-display text-xl font-semibold text-restaurant-dark-brown mb-2">
              {steps[currentStep]?.title}
            </h3>
            <p className="text-restaurant-warm-gray">
              {steps[currentStep]?.desc}
            </p>
          </div>

          {/* Steps List */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center space-x-4 p-3 rounded-xl transition-all duration-300 ${
                  index < currentStep
                    ? 'bg-restaurant-gold/10 text-restaurant-gold'
                    : index === currentStep
                    ? 'bg-restaurant-gold/20 text-restaurant-gold scale-105'
                    : 'bg-gray-50 text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index < currentStep
                      ? 'bg-restaurant-gold text-white'
                      : index === currentStep
                      ? 'bg-restaurant-gold text-white animate-pulse'
                      : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <div>
                  <p className="font-semibold">{step.title}</p>
                  <p className="text-xs opacity-75">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Processing Info */}
      <div className="p-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
          <p className="text-sm text-restaurant-warm-gray">
            🧠 <strong>Enhanced AI:</strong> Using contextual prompts and cuisine detection for accurate dish images
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuProcessing;
