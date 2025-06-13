
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

  // Generate new session ID for each scan
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  };

  // Clear all state when starting new scan
  const clearAllState = () => {
    console.log('Clearing all state for new scan');
    setCapturedMenu('');
    setExtractedText('');
    setDishes([]);
    setSelectedDish(null);
    setFavorites(new Set());
    setSessionId(generateSessionId());
    
    // Clear any cached data
    localStorage.removeItem('menuVision_lastScan');
    sessionStorage.clear();
  };

  const handleScanMenu = () => {
    clearAllState();
    setAppState('camera');
  };

  const handleUploadMenu = () => {
    clearAllState();
    setAppState('camera');
  };

  const handleCaptureComplete = (imageData: string) => {
    console.log('Capture complete, setting menu image');
    setCapturedMenu(imageData);
    setAppState('processing');
  };

  const handleTextExtracted = (text: string) => {
    console.log('Text extracted:', text);
    setExtractedText(text);
    setAppState('verification');
  };

  const handleTextConfirmed = (confirmedText: string) => {
    console.log('Text confirmed, processing dishes...');
    setExtractedText(confirmedText);
    setAppState('processing');
  };

  const handleProcessingComplete = (processedDishes: Dish[]) => {
    console.log('Processing complete with dishes:', processedDishes);
    setDishes(processedDishes);
    setAppState('menu');
  };

  const handleDishSelect = (dish: Dish) => {
    setSelectedDish(dish);
  };

  const handleNewScan = () => {
    console.log('Starting new scan - clearing all data');
    clearAllState();
    setAppState('welcome');
  };

  const handleBackToCamera = () => {
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
      setSessionId(generateSessionId());
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background">
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
