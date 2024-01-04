import OpenAI from 'openai';
import { configDotenv } from 'dotenv';
import fs from 'fs';
import { RECIPES_DATA2 } from './recipes-update.js';
configDotenv();

const data = RECIPES_DATA2;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateData = async (recipe: any) => {
  try {
    const prompt =
      `The recipe is for ${recipe.strMeal}. It is a ${recipe.category} dish. ` +
      `The instructions are: ${recipe.strInstructions} ` +
      `The ingredients are: ${recipe.ingredients
        .map((ing: any) => ing.ingredientName)
        .join(', ')}. ` +
      `Can you provide a max 100 words description and cookingTime value of NUMBER represented in minutes for this recipe?
    Write your response in this format: {"description": "<description>", "cookingTime": "<cookingTime>"} so JSON format.`;

    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt,
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const responseObject = JSON.parse(response.choices[0].text.trim());

    return {
      description: responseObject?.description,
      cookingTime: parseFloat(responseObject?.cookingTime),
    };
  } catch (error) {
    console.log(error);
  }
};

const processRecipes = async (data: any) => {
  try {
    let recipes = [];

    for (const recipe of data) {
      if (recipe.strDescription === '') {
        const res = await generateData(recipe);

        recipe.strDescription = res?.description || '';
        recipe.cookingTime = res?.cookingTime || 60;
        recipe.visibility = 'public';

        recipes.push(recipe);
        console.log(`Recipe ${recipe.strMeal} processed!`);
      }
    }

    console.log('All recipes processed!');

    fs.writeFile(
      './recipes-update2.json',
      JSON.stringify(recipes, null, 2),
      'utf8',
      (err) => {
        if (err) {
          return console.error('Error writing file:', err);
        }

        console.log('File saved successfully!');
      }
    );
  } catch (error) {
    console.log(error);
  }
};

processRecipes(data);
