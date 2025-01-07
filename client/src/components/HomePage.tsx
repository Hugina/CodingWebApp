import * as React from 'react';
import InsertRecipePopUp from './InsertRecipePopUp';

const HomePage = () => {
  return (
    <div>
      <h2>Welcome To Recipeasy!</h2>
      <p>Here you can find recipes for all your favorite dishes!</p>
      <InsertRecipePopUp />
    </div>
  );
};

export default HomePage;
