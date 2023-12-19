import mongoose from 'mongoose';

import Ingredient from './IngredientModel.js';

const shoppingListItemSchema = new mongoose.Schema<ShoppingListItemDocument>(
  {
    quantity: {
      type: String,
      required: [true, 'Value is required'],
    },
    ingredient: {
      type: mongoose.Schema.ObjectId,
      ref: 'Ingredient',
      required: [true, 'Ingredient is required'],
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      select: false,
    },
  },
  { versionKey: false, timestamps: true }
);

// Populate ingredient field with every find query
shoppingListItemSchema.pre<mongoose.Query<any, any>>(/^find/, function (next) {
  this.populate('ingredient', 'name image', Ingredient);

  next();
});

const ShoppingListItem = mongoose.model<ShoppingListItemDocument>(
  'shoppingListItem',
  shoppingListItemSchema
);

export default ShoppingListItem;
