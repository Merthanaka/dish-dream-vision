
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface MenuProcessingProps {
  menuImage: string;
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

const MenuProcessing = ({ menuImage, onProcessingComplete }: MenuProcessingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { title: "Scanning Menu", desc: "Reading text from your photo" },
    { title: "Identifying Dishes", desc: "Finding all menu items" },
    { title: "Generating Images", desc: "Creating beautiful dish photos" },
    { title: "Finalizing Menu", desc: "Organizing your visual menu" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Processing complete, generate mock dishes
          const mockDishes: Dish[] = [
            {
              id: '1',
              name: 'Caesar Salad',
              description: 'Crisp romaine lettuce, parmesan cheese, croutons, house caesar dressing',
              price: '$12',
              category: 'Appetizers',
              image: `https://images.unsplash.com/photo-1512852939750-1305098529bf?w=400&h=300&fit=crop&crop=center`,
              ingredients: ['Romaine lettuce', 'Parmesan cheese', 'Croutons', 'Caesar dressing']
            },
            {
              id: '2',
              name: 'Bruschetta',
              description: 'Grilled bread topped with diced tomatoes, fresh basil, garlic, balsamic glaze',
              price: '$10',
              category: 'Appetizers',
              image: `https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop&crop=center`,
              ingredients: ['Grilled bread', 'Tomatoes', 'Basil', 'Garlic', 'Balsamic']
            },
            {
              id: '3',
              name: 'Grilled Salmon',
              description: 'Herb-crusted Atlantic salmon with lemon butter sauce and seasonal vegetables',
              price: '$24',
              category: 'Main Courses',
              image: `https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&crop=center`,
              ingredients: ['Atlantic salmon', 'Herbs', 'Lemon', 'Butter', 'Vegetables']
            },
            {
              id: '4',
              name: 'Ribeye Steak',
              description: '12oz prime ribeye with garlic mashed potatoes and grilled asparagus',
              price: '$32',
              category: 'Main Courses',
              image: `https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=center`,
              ingredients: ['Ribeye steak', 'Mashed potatoes', 'Asparagus', 'Garlic']
            },
            {
              id: '5',
              name: 'Chicken Parmesan',
              description: 'Breaded chicken cutlet with mozzarella cheese, marinara sauce, served with pasta',
              price: '$18',
              category: 'Main Courses',
              image: `https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop&crop=center`,
              ingredients: ['Chicken breast', 'Mozzarella', 'Marinara sauce', 'Pasta']
            }
          ];
          
          setTimeout(() => {
            onProcessingComplete(mockDishes);
          }, 1000);
          
          clearInterval(timer);
          return 100;
        }
        
        const newProgress = prev + 2;
        const stepIndex = Math.floor(newProgress / 25);
        setCurrentStep(Math.min(stepIndex, steps.length - 1));
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onProcessingComplete]);

  return (
    <div className="min-h-screen bg-gradient-warm flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-6 px-6 text-center">
        <h1 className="font-display text-2xl font-bold text-restaurant-dark-brown mb-2">
          Processing Your Menu
        </h1>
        <p className="text-restaurant-warm-gray">
          Our AI is working its magic
        </p>
      </div>

      {/* Menu Preview */}
      <div className="px-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <img
            src={menuImage}
            alt="Menu being processed"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-restaurant-gold/20 to-transparent rounded-2xl"></div>
        </div>
      </div>

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

      {/* Fun Facts */}
      <div className="p-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
          <p className="text-sm text-restaurant-warm-gray">
            💡 <strong>Did you know?</strong> Visual menus can increase order satisfaction by up to 40%
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuProcessing;
