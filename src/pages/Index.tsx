
import React, { useState } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';
import CameraCapture from '../components/CameraCapture';
import MenuProcessing from '../components/MenuProcessing';
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

type AppState = 'welcome' | 'camera' | 'processing' | 'menu';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [capturedMenu, setCapturedMenu] = useState<string>('');
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleScanMenu = () => {
    setAppState('camera');
  };

  const handleUploadMenu = () => {
    setAppState('camera');
  };

  const handleCaptureComplete = (imageData: string) => {
    setCapturedMenu(imageData);
    setAppState('processing');
  };

  const handleProcessingComplete = (processedDishes: Dish[]) => {
    setDishes(processedDishes);
    setAppState('menu');
  };

  const handleDishSelect = (dish: Dish) => {
    setSelectedDish(dish);
  };

  const handleNewScan = () => {
    setAppState('welcome');
    setCapturedMenu('');
    setDishes([]);
    setSelectedDish(null);
  };

  const handleBackToCamera = () => {
    setAppState('welcome');
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
          onProcessingComplete={handleProcessingComplete}
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
