import * as React from 'react';
import InsertRecipePopUp from './InsertRecipePopUp';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/saved-recipes');
  };
  return (
    <div>
      <h2>Welcome To Recipeasy!</h2>
      <p>Here you can find recipes for all your favorite dishes!</p>
      <InsertRecipePopUp />
      <button onClick={handleNavigate}>Go to Saved Recipes</button>
    </div>
  );
};

export default HomePage;
