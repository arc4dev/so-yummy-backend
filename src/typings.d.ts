type Role = 'user' | 'admin';

enum RecipeCategory {
  Beef = 'Beef',
  Breakfast = 'Breakfast',
  Chicken = 'Chicken',
  Dessert = 'Dessert',
  Goat = 'Goat',
  Lamb = 'Lamb',
  Miscellaneous = 'Miscellaneous',
  Pasta = 'Pasta',
  Pork = 'Pork',
  Seafood = 'Seafood',
  Side = 'Side',
  Starter = 'Starter',
  Vegan = 'Vegan',
  Vegetarian = 'Vegetarian',
}

// * MODELS *
interface UserDocument extends mongoose.Document {
  id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  verify: boolean;
  verificationToken: string | null;
  role: Role;
  isCorrectPassword(password: string, hashedPassword: string): Promise<boolean>;
}

interface IngredientDocument extends mongoose.Document {
  name: string;
  image: string;
}

interface IngredientRef {
  ingredient: mongoose.Types.ObjectId | IngredientDocument;
  ingredientMeasure: string;
}

interface RecipeDocument extends mongoose.Document {
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  ingredients: IngredientRef[];
  category: RecipeCategory;
  visibility: 'public' | 'private';
  owner: mongoose.Types.ObjectId | UserDocument | undefined;
}

interface ShoppingListItemDocument extends mongoose.Document {
  quantity: string;
  ingredient: mongoose.Types.ObjectId | IngredientDocument;
  owner: mongoose.Types.ObjectId | UserDocument;
}
