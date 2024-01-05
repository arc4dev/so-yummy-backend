const paginate = async (
  model: any,
  query: any,
  pageCurrent: number,
  pageLimit: number
) => {
  try {
    const recipes = await model
      .find(query)
      .skip((pageCurrent - 1) * pageLimit)
      .limit(pageLimit);

    const totalPages = Math.ceil(
      (await model.countDocuments(query)) / pageLimit
    );

    return {
      results: recipes.length,
      page: pageCurrent,
      totalPages,
      data: recipes,
    };
  } catch (error) {
    throw error;
  }
};

export default paginate;
