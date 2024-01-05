import mongoose from 'mongoose';

import Ingredient from './IngredientModel.js';
import User from './UserModel.js';

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
      required: [true, 'Shopping list item must belong to a user'],
      select: false,
    },
  },
  { versionKey: false, timestamps: true }
);

// Populate ingredient and owner field with every find query
shoppingListItemSchema.pre<mongoose.Query<any, any>>(/^find/, function (next) {
  this.populate('ingredient', 'name image', Ingredient).populate(
    'owner',
    'name email',
    User
  );

  next();
});

const ShoppingListItem = mongoose.model<ShoppingListItemDocument>(
  'ShoppingListItem',
  shoppingListItemSchema
);

export default ShoppingListItem;
