import Recipe from '../models/RecipeModel.js';
import connectDB from '../utils/connectDB.js';

async function run() {
  await connectDB();

  // Use the Recipe model
  await Recipe.updateMany({}, { $set: { visibility: 'public' } });
}

run().catch((err) => console.error(err));
