
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
  let prompt = `Professional restaurant photograph of ${cleanName}`;
  
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

// Fixed image URL generation with working Unsplash images
export const generateImageUrl = (prompt: string, sessionId: string): string => {
  const foodKeywords = extractFoodKeywords(prompt);
  const searchTerm = foodKeywords.length > 0 ? foodKeywords[0] : 'food';
  
  console.log('Generating image for prompt:', prompt);
  console.log('Extracted keywords:', foodKeywords);
  console.log('Search term:', searchTerm);
  
  // High-quality food images from Unsplash with working photo IDs
  const foodImageUrls = {
    'salmon': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop&crop=center&q=80&auto=format',
    'chicken': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop&crop=center&q=80&auto=format',
    'beef': 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&h=300&fit=crop&crop=center&q=80&auto=format',
    'pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&crop=center&q=80&auto=format',
    'pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&crop=center&q=80&auto=format',
    'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center&q=80&auto=format',
    'soup': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop&crop=center&q=80&auto=format',
    'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center&q=80&auto=format',
    'seafood': 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop&crop=center&q=80&auto=format',
    'vegetables': 'https://images.unsplash.com/photo-1540420773983-0e83dc30bb86?w=400&h=300&fit=crop&crop=center&q=80&auto=format',
    'dessert': 'https://images.unsplash.com/photo-1551024506-0bccd0e65793?w=400&h=300&fit=crop&crop=center&q=80&auto=format',
    'cake': 'https://images.unsplash.com/photo-1578985545622-7c14a934b83b?w=400&h=300&fit=crop&crop=center&q=80&auto=format',
    'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&crop=center&q=80&auto=format',
    'cheese': 'https://images.unsplash.com/photo-1486297678162-ce23ef5fe92d?w=400&h=300&fit=crop&crop=center&q=80&auto=format',
    'fish': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center&q=80&auto=format',
    'meat': 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop&crop=center&q=80&auto=format',
    'rice': 'https://images.unsplash.com/photo-1536303047130-63d69c1dd4d4?w=400&h=300&fit=crop&crop=center&q=80&auto=format',
    'noodles': 'https://images.unsplash.com/photo-1555949258-eb67b1ef6cce?w=400&h=300&fit=crop&crop=center&q=80&auto=format',
    'food': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center&q=80&auto=format'
  };

  // Try to find a matching image URL
  let imageUrl = foodImageUrls['food']; // default fallback
  for (const [food, url] of Object.entries(foodImageUrls)) {
    if (searchTerm.toLowerCase().includes(food)) {
      imageUrl = url;
      console.log(`Found match for "${food}":`, url);
      break;
    }
  }

  // Add cache busting parameter with session ID
  const finalUrl = `${imageUrl}&cache=${sessionId}&t=${Date.now()}`;
  console.log('Final image URL:', finalUrl);
  
  return finalUrl;
};

const extractFoodKeywords = (prompt: string): string[] => {
  const foodTerms = [
    'salmon', 'chicken', 'beef', 'pasta', 'pizza', 'salad', 'soup', 'burger', 
    'sandwich', 'seafood', 'vegetables', 'dessert', 'cake', 'ice cream',
    'bread', 'cheese', 'fish', 'meat', 'rice', 'noodles'
  ];
  
  const lowerPrompt = prompt.toLowerCase();
  return foodTerms.filter(term => lowerPrompt.includes(term));
};

export const parseMenuText = (menuText: string, sessionId: string): Dish[] => {
  console.log('=== PARSING MENU TEXT ===');
  console.log('Session ID:', sessionId);
  console.log('Menu text length:', menuText.length);
  
  const sections = detectMenuSections(menuText);
  const cuisineType = detectCuisineType(menuText);
  const dishes: Dish[] = [];

  console.log('Detected sections:', sections.length);
  console.log('Detected cuisine type:', cuisineType);

  sections.forEach((section, sectionIndex) => {
    console.log(`Processing section ${sectionIndex + 1}: ${section.title} (${section.dishes.length} dishes)`);
    
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
      console.log(`Generated prompt for "${name}":`, imagePrompt);
      
      // Generate image URL with session ID for cache busting
      const imageUrl = generateImageUrl(imagePrompt, sessionId);
      console.log(`Generated image URL for "${name}":`, imageUrl);
      
      const dish: Dish = {
        id: `${sessionId}-${sectionIndex}-${index}`,
        name,
        description,
        price,
        category,
        image: imageUrl,
        ingredients
      };
      
      dishes.push(dish);
      console.log(`Added dish: ${name} (ID: ${dish.id})`);
    });
  });

  console.log('=== PARSING COMPLETE ===');
  console.log('Total dishes parsed:', dishes.length);
  console.log('Final dishes:', dishes.map(d => ({ name: d.name, id: d.id, hasImage: !!d.image })));
  
  return dishes;
};
