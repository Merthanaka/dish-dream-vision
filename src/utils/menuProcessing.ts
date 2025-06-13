
interface Dish {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  ingredients: string[];
}

interface MenuSection {
  title: string;
  dishes: string[];
}

export const detectCuisineType = (menuText: string): string => {
  const cuisineKeywords = {
    italian: ['pasta', 'pizza', 'risotto', 'bruschetta', 'tiramisu', 'parmesan'],
    asian: ['sushi', 'ramen', 'pad thai', 'teriyaki', 'tempura', 'kimchi'],
    mexican: ['tacos', 'burrito', 'quesadilla', 'salsa', 'guacamole', 'enchilada'],
    american: ['burger', 'fries', 'bbq', 'wings', 'sandwich', 'steak'],
    mediterranean: ['hummus', 'falafel', 'tzatziki', 'kebab', 'olive', 'pita'],
    french: ['croissant', 'baguette', 'coq au vin', 'ratatouille', 'crepe'],
    seafood: ['salmon', 'lobster', 'shrimp', 'scallops', 'crab', 'tuna']
  };

  const lowerText = menuText.toLowerCase();
  
  for (const [cuisine, keywords] of Object.entries(cuisineKeywords)) {
    const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
    if (matches >= 2) {
      return cuisine;
    }
  }
  
  return 'international';
};

export const detectMenuSections = (menuText: string): MenuSection[] => {
  const sectionHeaders = [
    'appetizers', 'starters', 'apps',
    'salads', 'soups',
    'main courses', 'mains', 'entrees', 'pasta', 'seafood', 'meat',
    'desserts', 'sweets',
    'beverages', 'drinks', 'cocktails', 'wine'
  ];

  const lines = menuText.split('\n').map(line => line.trim()).filter(line => line);
  const sections: MenuSection[] = [];
  let currentSection = '';
  let currentDishes: string[] = [];

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    const isHeader = sectionHeaders.some(header => lowerLine.includes(header));
    
    if (isHeader) {
      if (currentSection && currentDishes.length > 0) {
        sections.push({ title: currentSection, dishes: [...currentDishes] });
      }
      currentSection = line;
      currentDishes = [];
    } else if (line.length > 3 && !line.match(/^\$\d+/)) {
      currentDishes.push(line);
    }
  }

  if (currentSection && currentDishes.length > 0) {
    sections.push({ title: currentSection, dishes: [...currentDishes] });
  }

  return sections;
};

export const categorizeItem = (itemText: string, sectionTitle: string): string => {
  const lowerItem = itemText.toLowerCase();
  const lowerSection = sectionTitle.toLowerCase();

  if (lowerSection.includes('appetizer') || lowerSection.includes('starter') || lowerSection.includes('apps')) {
    return 'Appetizers';
  }
  if (lowerSection.includes('salad')) return 'Salads';
  if (lowerSection.includes('soup')) return 'Soups';
  if (lowerSection.includes('main') || lowerSection.includes('entree') || lowerSection.includes('pasta') || lowerSection.includes('seafood') || lowerSection.includes('meat')) {
    return 'Main Courses';
  }
  if (lowerSection.includes('dessert') || lowerSection.includes('sweet')) {
    return 'Desserts';
  }
  if (lowerSection.includes('drink') || lowerSection.includes('beverage') || lowerSection.includes('cocktail')) {
    return 'Beverages';
  }

  // Fallback categorization based on item content
  if (lowerItem.includes('salad')) return 'Salads';
  if (lowerItem.includes('soup')) return 'Soups';
  if (lowerItem.includes('cake') || lowerItem.includes('ice cream') || lowerItem.includes('dessert')) {
    return 'Desserts';
  }
  
  return 'Main Courses';
};

export const extractIngredients = (description: string): string[] => {
  const commonIngredients = [
    'chicken', 'beef', 'pork', 'salmon', 'tuna', 'shrimp', 'lobster',
    'tomato', 'onion', 'garlic', 'mushroom', 'spinach', 'arugula',
    'mozzarella', 'parmesan', 'cheddar', 'feta',
    'olive oil', 'butter', 'cream', 'lemon', 'basil', 'oregano'
  ];

  const lowerDesc = description.toLowerCase();
  return commonIngredients.filter(ingredient => 
    lowerDesc.includes(ingredient)
  );
};

export const generateImagePrompt = (
  dishName: string, 
  description: string, 
  category: string, 
  cuisineType: string,
  ingredients: string[]
): string => {
  // Clean dish name
  const cleanName = dishName.replace(/\$\d+.*/, '').trim();
  
  // Build context-rich prompt
  let prompt = `A professional restaurant photograph of ${cleanName}`;
  
  // Add category context
  if (category === 'Appetizers') {
    prompt += ', served as an elegant appetizer';
  } else if (category === 'Main Courses') {
    prompt += ', served as a main course dish';
  } else if (category === 'Desserts') {
    prompt += ', served as a beautiful dessert';
  }
  
  // Add description if available
  if (description && description.trim() !== cleanName) {
    prompt += `. ${description}`;
  }
  
  // Add ingredients context
  if (ingredients.length > 0) {
    prompt += `. Made with ${ingredients.slice(0, 3).join(', ')}`;
  }
  
  // Add cuisine style
  if (cuisineType !== 'international') {
    prompt += `. ${cuisineType.charAt(0).toUpperCase() + cuisineType.slice(1)} cuisine style`;
  }
  
  // Add professional photography context
  prompt += '. Professional food photography, appetizing presentation, served on elegant restaurant dinnerware, perfect lighting, high quality image';
  
  return prompt;
};

export const parseMenuText = (menuText: string): Dish[] => {
  const sections = detectMenuSections(menuText);
  const cuisineType = detectCuisineType(menuText);
  const dishes: Dish[] = [];

  sections.forEach(section => {
    section.dishes.forEach((dishLine, index) => {
      // Extract dish name, description, and price
      const priceMatch = dishLine.match(/\$(\d+(?:\.\d{2})?)/);
      const price = priceMatch ? `$${priceMatch[1]}` : '';
      
      // Remove price from dish line
      const dishWithoutPrice = dishLine.replace(/\$\d+(?:\.\d{2})?/, '').trim();
      
      // Split name and description (usually separated by dash or comma)
      const parts = dishWithoutPrice.split(/[-–—,]/);
      const name = parts[0].trim();
      const description = parts.slice(1).join(',').trim() || name;
      
      const category = categorizeItem(dishLine, section.title);
      const ingredients = extractIngredients(description);
      
      // Generate enhanced prompt for image generation
      const imagePrompt = generateImagePrompt(name, description, category, cuisineType, ingredients);
      
      dishes.push({
        id: `${section.title}-${index}`,
        name,
        description,
        price,
        category,
        image: `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center&q=80&prompt=${encodeURIComponent(imagePrompt)}`,
        ingredients
      });
    });
  });

  return dishes;
};
