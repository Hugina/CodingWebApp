import * as React from 'react';
import { useState } from 'react';
import * as client from '../RecipeServerClient';

const RecipeScreen = () => {
  const [recipes: Recipe[], setRecipes] = useState([]);

  return <button onClick={() => setRecipes(client.getRecipes())}> Insert new recipe</button>;
};

export default RecipeScreen;
