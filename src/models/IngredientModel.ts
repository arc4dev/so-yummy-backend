import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema<IngredientDocument>(
  {
    name: {
      type: String,
      required: [true, "The 'name' field is required."],
    },
    image: {
      type: String,
      required: [true, "The 'image' field is required."],
    },
  },
  {
    versionKey: false,
  }
);

const Ingredient = mongoose.model<IngredientDocument>(
  'Ingredient',
  ingredientSchema
);

export default Ingredient;
