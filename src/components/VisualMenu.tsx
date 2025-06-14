
import React, { useState } from 'react';
import { Search, Filter, Heart, Share, Save, RefreshCw } from 'lucide-react';
import { generateImagePrompt, detectCuisineType, generateImageUrl } from '../utils/menuProcessing';

interface Dish {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  ingredients: string[];
}

interface VisualMenuProps {
  dishes: Dish[];
  onDishSelect: (dish: Dish) => void;
  onNewScan: () => void;
}

const VisualMenu = ({ dishes, onDishSelect, onNewScan }: VisualMenuProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [regeneratingImages, setRegeneratingImages] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const categories = ['All', ...new Set(dishes.map(dish => dish.category))];
  
  const filteredDishes = dishes.filter(dish => {
    const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dish.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (dishId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(dishId)) {
      newFavorites.delete(dishId);
    } else {
      newFavorites.add(dishId);
    }
    setFavorites(newFavorites);
  };

  const regenerateImage = async (dish: Dish) => {
    console.log('Regenerating image for:', dish.name);
    setRegeneratingImages(prev => new Set([...prev, dish.id]));
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(dish.id);
      return newSet;
    });
    
    // Simulate API call delay
    setTimeout(() => {
      const cuisineType = detectCuisineType(`${dish.name} ${dish.description}`);
      const enhancedPrompt = generateImagePrompt(
        dish.name,
        dish.description,
        dish.category,
        cuisineType,
        dish.ingredients
      );
      
      console.log('New prompt for', dish.name, ':', enhancedPrompt);
      
      // Update the dish image with a new URL including timestamp
      const sessionId = dish.id.split('-')[0];
      const newImageUrl = generateImageUrl(enhancedPrompt, `${sessionId}-retry-${Date.now()}`);
      dish.image = newImageUrl;
      
      console.log('New image URL:', newImageUrl);
      
      setRegeneratingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(dish.id);
        return newSet;
      });
    }, 2000);
  };

  const handleImageError = (dishId: string) => {
    console.log('Image failed to load for dish:', dishId);
    setImageErrors(prev => new Set([...prev, dishId]));
  };

  const handleImageLoad = (dishId: string) => {
    console.log('Image loaded successfully for dish:', dishId);
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(dishId);
      return newSet;
    });
  };

  const groupedDishes = categories.reduce((acc, category) => {
    if (category === 'All') return acc;
    acc[category] = filteredDishes.filter(dish => dish.category === category);
    return acc;
  }, {} as Record<string, Dish[]>);

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md shadow-sm z-10">
        <div className="pt-12 pb-4 px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-restaurant-dark-brown">
                Enhanced Visual Menu
              </h1>
              <p className="text-restaurant-warm-gray text-sm">
                {dishes.length} dishes with contextual AI images
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onNewScan}
                className="btn-secondary text-sm px-4 py-2"
              >
                New Scan
              </button>
              <button
                onClick={onNewScan}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Clear & Reset
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-restaurant-gold focus:bg-white transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  selectedCategory === category
                    ? 'bg-restaurant-gold text-white shadow-lg'
                    : 'bg-gray-100 text-restaurant-warm-gray hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="px-6 pb-6">
        {selectedCategory === 'All' ? (
          // Grouped by category
          Object.entries(groupedDishes).map(([category, categoryDishes]) => (
            <div key={category} className="mb-8">
              <h2 className="font-display text-xl font-semibold text-restaurant-dark-brown mb-4 px-2">
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoryDishes.map(dish => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    isFavorite={favorites.has(dish.id)}
                    isRegenerating={regeneratingImages.has(dish.id)}
                    hasImageError={imageErrors.has(dish.id)}
                    onSelect={() => onDishSelect(dish)}
                    onToggleFavorite={() => toggleFavorite(dish.id)}
                    onRegenerateImage={() => regenerateImage(dish)}
                    onImageError={() => handleImageError(dish.id)}
                    onImageLoad={() => handleImageLoad(dish.id)}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          // Single category view
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredDishes.map(dish => (
              <DishCard
                key={dish.id}
                dish={dish}
                isFavorite={favorites.has(dish.id)}
                isRegenerating={regeneratingImages.has(dish.id)}
                hasImageError={imageErrors.has(dish.id)}
                onSelect={() => onDishSelect(dish)}
                onToggleFavorite={() => toggleFavorite(dish.id)}
                onRegenerateImage={() => regenerateImage(dish)}
                onImageError={() => handleImageError(dish.id)}
                onImageLoad={() => handleImageLoad(dish.id)}
              />
            ))}
          </div>
        )}

        {filteredDishes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-display text-lg font-semibold text-restaurant-dark-brown mb-2">
              No dishes found
            </h3>
            <p className="text-restaurant-warm-gray">
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface DishCardProps {
  dish: Dish;
  isFavorite: boolean;
  isRegenerating: boolean;
  hasImageError: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
  onRegenerateImage: () => void;
  onImageError: () => void;
  onImageLoad: () => void;
}

const DishCard = ({ 
  dish, 
  isFavorite, 
  isRegenerating, 
  hasImageError,
  onSelect, 
  onToggleFavorite, 
  onRegenerateImage,
  onImageError,
  onImageLoad
}: DishCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div className="dish-card animate-fade-in">
      <div className="relative">
        {hasImageError ? (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-2xl">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-xl">🍽️</span>
              </div>
              <p className="text-gray-500 text-sm mb-2">Image failed to load</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRegenerateImage();
                }}
                className="text-xs text-restaurant-gold hover:underline bg-white px-2 py-1 rounded"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <>
            {!imageLoaded && (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-2xl absolute inset-0 z-10">
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 border-2 border-restaurant-gold border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500 text-sm">Loading image...</p>
                </div>
              </div>
            )}
            <img
              src={dish.image}
              alt={dish.name}
              className={`w-full h-48 object-cover transition-all rounded-t-2xl ${
                isRegenerating ? 'opacity-50' : ''
              } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onClick={onSelect}
              onError={() => {
                console.log('Image error for:', dish.name, dish.image);
                setImageLoaded(true);
                onImageError();
              }}
              onLoad={() => {
                console.log('Image loaded for:', dish.name);
                setImageLoaded(true);
                onImageLoad();
              }}
            />
          </>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-t-2xl"></div>
        
        {isRegenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-t-2xl z-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
              <RefreshCw className="w-6 h-6 text-restaurant-gold animate-spin" />
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 z-30">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRegenerateImage();
            }}
            disabled={isRegenerating}
            className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white backdrop-blur-sm transition-all disabled:opacity-50"
            title="Regenerate image"
          >
            <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 bg-restaurant-gold text-white px-3 py-1 rounded-full text-sm font-bold z-30">
          {dish.price}
        </div>
      </div>

      <div className="p-4" onClick={onSelect}>
        <h3 className="font-display font-semibold text-restaurant-dark-brown mb-2 line-clamp-1">
          {dish.name}
        </h3>
        <p className="text-restaurant-warm-gray text-sm mb-3 line-clamp-2">
          {dish.description}
        </p>

        {/* Ingredients */}
        <div className="flex flex-wrap gap-1 mb-3">
          {dish.ingredients.slice(0, 3).map((ingredient, index) => (
            <span
              key={index}
              className="bg-restaurant-gold/10 text-restaurant-gold text-xs px-2 py-1 rounded-full"
            >
              {ingredient}
            </span>
          ))}
          {dish.ingredients.length > 3 && (
            <span className="text-restaurant-gold text-xs px-2 py-1">
              +{dish.ingredients.length - 3} more
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex-1 bg-restaurant-gold/10 text-restaurant-gold py-2 px-3 rounded-lg text-sm font-medium hover:bg-restaurant-gold/20 transition-colors">
            View Details
          </button>
          <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <Share className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisualMenu;
