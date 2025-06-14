
import React, { useState, useEffect } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';
import CameraCapture from '../components/CameraCapture';
import MenuProcessing from '../components/MenuProcessing';
import TextVerification from '../components/TextVerification';
import VisualMenu from '../components/VisualMenu';
import DishDetailModal from '../components/DishDetailModal';

interface Dish {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  ingredients: string[];
}

type AppState = 'welcome' | 'camera' | 'processing' | 'verification' | 'menu';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [capturedMenu, setCapturedMenu] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sessionId, setSessionId] = useState<string>('');
  const [isResetting, setIsResetting] = useState(false);

  // Generate new session ID for each scan
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  };

  // Complete application reset function
  const resetApplication = async () => {
    console.log('COMPLETE RESET: Clearing all application state');
    setIsResetting(true);
    
    // Clear all state variables immediately
    setCapturedMenu('');
    setExtractedText('');
    setDishes([]);
    setSelectedDish(null);
    setFavorites(new Set());
    
    // Clear any cached data
    localStorage.clear();
    sessionStorage.clear();
    
    // Generate new session ID
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    console.log('New session ID generated:', newSessionId);
    
    // Small delay to ensure state is cleared
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setIsResetting(false);
    console.log('Reset complete - application state cleared');
  };

  const handleScanMenu = async () => {
    await resetApplication();
    setAppState('camera');
  };

  const handleUploadMenu = async () => {
    await resetApplication();
    setAppState('camera');
  };

  const handleCaptureComplete = (imageData: string) => {
    console.log('Capture complete for session:', sessionId);
    setCapturedMenu(imageData);
    setAppState('processing');
  };

  const handleTextExtracted = (text: string) => {
    console.log('Text extracted for session:', sessionId);
    setExtractedText(text);
    setAppState('verification');
  };

  const handleTextConfirmed = (confirmedText: string) => {
    console.log('Text confirmed for session:', sessionId);
    setExtractedText(confirmedText);
    setAppState('processing');
  };

  const handleProcessingComplete = (processedDishes: Dish[]) => {
    console.log('Processing complete for session:', sessionId, 'with dishes:', processedDishes);
    setDishes(processedDishes);
    setAppState('menu');
  };

  const handleDishSelect = (dish: Dish) => {
    setSelectedDish(dish);
  };

  const handleNewScan = async () => {
    console.log('Starting new scan - complete reset');
    await resetApplication();
    setAppState('welcome');
  };

  const handleBackToCamera = async () => {
    await resetApplication();
    setAppState('welcome');
  };

  const handleRetakePhoto = () => {
    setAppState('camera');
  };

  const toggleFavorite = (dishId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(dishId)) {
      newFavorites.delete(dishId);
    } else {
      newFavorites.add(dishId);
    }
    setFavorites(newFavorites);
  };

  // Initialize session ID on mount
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      console.log('Initial session ID:', newSessionId);
    }
  }, [sessionId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Component unmounting - cleaning up');
      setCapturedMenu('');
      setExtractedText('');
      setDishes([]);
      setSelectedDish(null);
      setFavorites(new Set());
    };
  }, []);

  // Show loading state during reset
  if (isResetting) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-restaurant-gold rounded-full flex items-center justify-center animate-spin">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <p className="text-restaurant-dark-brown font-medium">Resetting application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Debug Panel - Remove in production */}
      <div className="fixed bottom-4 right-4 z-50 bg-white p-2 rounded-lg shadow-lg border text-xs">
        <div className="mb-2">Session: {sessionId?.slice(-8)}</div>
        <div className="mb-2">State: {appState}</div>
        <div className="mb-2">Dishes: {dishes.length}</div>
        <button
          onClick={() => {
            console.log('DEBUG STATE:', {
              appState,
              sessionId,
              capturedMenu: !!capturedMenu,
              extractedText: !!extractedText,
              dishes: dishes.length,
              selectedDish: !!selectedDish
            });
          }}
          className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-2"
        >
          Log State
        </button>
        <button
          onClick={handleNewScan}
          className="bg-red-500 text-white px-2 py-1 rounded text-xs"
        >
          Force Reset
        </button>
      </div>

      {appState === 'welcome' && (
        <WelcomeScreen
          onScanMenu={handleScanMenu}
          onUploadMenu={handleUploadMenu}
        />
      )}

      {appState === 'camera' && (
        <CameraCapture
          onCapture={handleCaptureComplete}
          onBack={handleBackToCamera}
        />
      )}

      {appState === 'processing' && (
        <MenuProcessing
          menuImage={capturedMenu}
          extractedText={extractedText}
          sessionId={sessionId}
          onTextExtracted={handleTextExtracted}
          onProcessingComplete={handleProcessingComplete}
        />
      )}

      {appState === 'verification' && (
        <TextVerification
          extractedText={extractedText}
          onConfirm={handleTextConfirmed}
          onEdit={handleRetakePhoto}
        />
      )}

      {appState === 'menu' && (
        <VisualMenu
          dishes={dishes}
          onDishSelect={handleDishSelect}
          onNewScan={handleNewScan}
        />
      )}

      {selectedDish && (
        <DishDetailModal
          dish={selectedDish}
          isOpen={!!selectedDish}
          onClose={() => setSelectedDish(null)}
          isFavorite={favorites.has(selectedDish.id)}
          onToggleFavorite={() => toggleFavorite(selectedDish.id)}
        />
      )}
    </div>
  );
};

export default Index;
