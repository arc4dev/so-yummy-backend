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

enum IngredientMeasure {
  tbs = 'tbs',
  tsp = 'tsp',
  kg = 'kg',
  g = 'g',
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
  id: mongoose.Types.ObjectId;
  name: string;
  image: string;
}

interface IngredientRef {
  ingredient: mongoose.Types.ObjectId | IngredientDocument;
  ingredientMeasure: IngredientMeasure;
}

interface RecipeDocument extends mongoose.Document {
  id: mongoose.Types.ObjectId;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strDescription: string;
  cookingTime: number;
  ingredients: IngredientRef[];
  category: RecipeCategory;
  visibility: 'public' | 'private';
  owner: mongoose.Types.ObjectId | UserDocument | undefined;
}

interface ShoppingListItemDocument extends mongoose.Document {
  id: mongoose.Types.ObjectId;
  quantity: string;
  ingredient: mongoose.Types.ObjectId | IngredientDocument;
  owner: mongoose.Types.ObjectId | UserDocument;
}
