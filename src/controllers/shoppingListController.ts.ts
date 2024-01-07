import { RequestHandler } from 'express';

import catchAsync from '../utils/catchAsync.js';
import ShoppingListItem from '../models/ShoppingListItemModel.js';
import paginate from '../utils/paginate.js';
import { RECIPES_PER_PAGE } from '../utils/constants.js';

const getOwnIngredients: RequestHandler = catchAsync(async (req, res, next) => {
  const { page = 1, limit = RECIPES_PER_PAGE } = req.query;
  const { id } = req.user as UserDocument;

  const shoppingListItems = await paginate(
    ShoppingListItem.find({ owner: id }),
    { page, limit }
  );

  res.status(200).json({ status: 'success', ...shoppingListItems });
});

const addOwnIngredient: RequestHandler = catchAsync(async (req, res, next) => {
  const { id } = req.user as UserDocument;
  const { quantity, ingredient } = req.body;

  // ! Check if the ingredient is already in the shopping list

  const shoppingListItem = await ShoppingListItem.create({
    quantity,
    ingredient,
    owner: id,
  });

  res.status(201).json({ status: 'success', data: shoppingListItem });
});

const removeOwnIngredient: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { id: userId } = req.user as UserDocument;
    const { ingredientId } = req.params;

    await ShoppingListItem.findOneAndDelete({
      _id: ingredientId,
      owner: userId,
    });

    res.status(204).json({ status: 'success', data: null });
  }
);

export default { getOwnIngredients, addOwnIngredient, removeOwnIngredient };
