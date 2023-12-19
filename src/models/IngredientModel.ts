import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The 'name' field is required."],
  },
  image: {
    type: String,
    required: [true, "The 'image' field is required."],
  },
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

export default Ingredient;
