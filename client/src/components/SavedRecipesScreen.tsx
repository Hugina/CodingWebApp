import * as React from 'react';
import { useState, useEffect } from 'react';
import getRecipes from '../RecipeServerClient';

const recipes = getRecipes();
console.log(recipes);

const SavedRecipesScreen = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const fetchedRecipes = await getRecipes();
      setRecipes(fetchedRecipes);
    };

    fetchRecipes();
  }, []); // Empty dependency array means it runs only once on mount

  return (
    <div>
      <h1>Saved Recipes Screen</h1>
      <p>Here are your saved recipes:</p>
      <ul>
        {recipes.map((recipe, index) => (
          <li key={index}>{recipe.name}</li>
        ))}
      </ul>
      <a href="/">Go back to Home Page</a>
    </div>
  );
};

export default SavedRecipesScreen;
