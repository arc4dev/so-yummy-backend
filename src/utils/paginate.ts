import { Query } from 'mongoose';

const paginate = async (
  query: Query<any, any>,
  { page, limit }: { page: any; limit: any }
) => {
  try {
    page = +page;
    limit = +limit;

    const totalPages = Math.ceil(
      (await query.model.countDocuments(query)) / limit
    );

    const recipes = await query.skip((page - 1) * limit).limit(limit);

    return {
      results: recipes.length,
      page,
      totalPages,
      data: recipes,
    };
  } catch (error) {
    throw error;
  }
};

export default paginate;
