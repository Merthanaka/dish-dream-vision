
import React from 'react';
import { Heart, Share, Save, Grid2x2 } from 'lucide-react';

interface Dish {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  ingredients: string[];
}

interface DishDetailModalProps {
  dish: Dish;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const DishDetailModal = ({ dish, isOpen, onClose, isFavorite, onToggleFavorite }: DishDetailModalProps) => {
  if (!isOpen) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: dish.name,
          text: dish.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${dish.name} - ${dish.description}`);
      alert('Dish details copied to clipboard!');
    }
  };

  const handleSave = () => {
    // Simulate saving to user's saved dishes
    alert('Dish saved to your favorites!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header Image */}
        <div className="relative h-64">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
          >
            ✕
          </button>

          {/* Category Badge */}
          <div className="absolute top-4 left-4 bg-restaurant-gold text-white px-3 py-1 rounded-full text-sm font-medium">
            {dish.category}
          </div>

          {/* Price */}
          <div className="absolute bottom-4 left-4 bg-white text-restaurant-dark-brown px-4 py-2 rounded-full font-bold text-lg shadow-lg">
            {dish.price}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {/* Title */}
          <h2 className="font-display text-2xl font-bold text-restaurant-dark-brown mb-3">
            {dish.name}
          </h2>

          {/* Description */}
          <p className="text-restaurant-warm-gray mb-6 leading-relaxed">
            {dish.description}
          </p>

          {/* Ingredients */}
          <div className="mb-6">
            <h3 className="font-semibold text-restaurant-dark-brown mb-3 flex items-center">
              <Grid2x2 className="w-4 h-4 mr-2" />
              Ingredients
            </h3>
            <div className="flex flex-wrap gap-2">
              {dish.ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="bg-restaurant-gold/10 text-restaurant-gold px-3 py-1 rounded-full text-sm border border-restaurant-gold/20"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          {/* Nutritional Info (Mock) */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-restaurant-dark-brown mb-3">
              Quick Info
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-restaurant-gold font-bold text-lg">
                  {Math.floor(Math.random() * 300 + 200)}
                </div>
                <div className="text-xs text-gray-600">Calories</div>
              </div>
              <div>
                <div className="text-restaurant-gold font-bold text-lg">
                  {Math.floor(Math.random() * 30 + 10)}min
                </div>
                <div className="text-xs text-gray-600">Prep Time</div>
              </div>
              <div>
                <div className="text-restaurant-gold font-bold text-lg">
                  {['🌶️', '🌶️🌶️', '🥗', '🍖'][Math.floor(Math.random() * 4)]}
                </div>
                <div className="text-xs text-gray-600">Type</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={onToggleFavorite}
              className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
                isFavorite
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart className={`w-5 h-5 mb-1 ${isFavorite ? 'fill-current' : ''}`} />
              <span className="text-xs font-medium">
                {isFavorite ? 'Favorited' : 'Favorite'}
              </span>
            </button>

            <button
              onClick={handleShare}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Share className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Share</span>
            </button>

            <button
              onClick={handleSave}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-restaurant-gold/10 text-restaurant-gold hover:bg-restaurant-gold/20 transition-colors"
            >
              <Save className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishDetailModal;
