import { RequestHandler } from 'express';

import catchAsync from '../utils/catchAsync.js';
import ShoppingListItem from '../models/shoppingListItemModel.js';
import paginate from '../utils/paginate.js';
import { RECIPES_PER_PAGE } from '../utils/constants.js';

const getShoppingList: RequestHandler = catchAsync(async (req, res, next) => {
  const { page = 1, limit = RECIPES_PER_PAGE } = req.query;
  const { id } = req.user as UserDocument;

  const shoppingListItems = await paginate(
    ShoppingListItem.find({ owner: id }),
    { page, limit }
  );

  res.status(200).json({ status: 'success', ...shoppingListItems });
});

const addShoppingListItem: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { id } = req.user as UserDocument;
    const { ingredientMeasure, ingredient } = req.body;

    const shoppingListItem = await ShoppingListItem.findOne({
      ingredient,
      owner: id,
    });
    if (shoppingListItem)
      return res.status(400).json({
        status: 'fail',
        message: 'This ingredient is already in the shopping list',
      });

    const newShoppingListItem = await ShoppingListItem.create({
      ingredientMeasure,
      ingredient,
      owner: id,
    });

    res.status(201).json({ status: 'success', data: newShoppingListItem });
  }
);

const deleteShoppingListItem: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { id: userId } = req.user as UserDocument;
    const { ingredientId } = req.params;

    await ShoppingListItem.deleteOne({
      ingredient: ingredientId,
      owner: userId,
    });

    res.status(204).json({ status: 'success', data: null });
  }
);

export default { getShoppingList, addShoppingListItem, deleteShoppingListItem };
