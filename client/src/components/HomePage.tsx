import * as React from 'react';
import InsertRecipePopUp from './InsertRecipePopUp';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  //const navigate = useNavigate();
  //const handleNavigate = () => {
  //  navigate('/saved-recipes');
  // };
  return (
    <div>
      <h2>Welcome To Recipeasy!</h2>
      <p>Here you can find recipes for all your favorite dishes!</p>
      <InsertRecipePopUp />
      <p />
      <a href="/saved-recipes">Go to my saved recipes</a>
    </div>
  );
  // Remove the unnecessary closing curly brace
};

export default HomePage;
