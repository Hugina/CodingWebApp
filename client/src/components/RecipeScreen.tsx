import * as React from 'react';
import { useState } from 'react';
//import * as client from '../RecipeServerClient';
import './RecipeScreen.css';

export default function RecipeScreen() {
  const [modal, setModal] = useState(false); //this hook will be used to toggle the modal window
  const [recipe, setRecipe] = useState(''); //this hook will be used to store the current recipe
  const [recipes, setRecipes] = useState([]); //this hook is an will be used to store all the recipes
  const toggleModal = () => setModal(!modal);
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    //TODO: i want Dor to explain this <HTMLTextAreaElement>
    setRecipe(e.target.value); //e.target = <textarea> that triggered the event and target.value = the value of the textarea
  };
  const handleSavedRecipes = () => {
    if (recipe.trim() !== '') {
      //this trim removes whitespace from both ends of the string ensuring the user doesn't save empty or whitespace only recipes
      //1. add it to the recipes array
      //2. clear the textarea
      //3. close the modal

      setRecipes([...recipes, recipe]);
      setRecipe('');
      console.log(...recipes);
      setModal(false);
    } else {
      alert('Please enter a recipe before saving!');
    }
  };
  return (
    <>
      <button onClick={toggleModal} className="btn-modal">
        Add Recipe
      </button>
      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay" /> //clicking on the overlay will close the modal
          <div className="modal-content">
            <h2>Hello, please enter your recipe below</h2>
            <textarea
              rows={10}
              cols={40}
              value={recipe}
              onChange={handleInputChange}
              placeholder="type your recipe here"
            />
            <button onClick={handleSavedRecipes}>Save This Recipe</button>
            <button className="close-modal" onClick={toggleModal}>
              Close this window
            </button>
          </div>
        </div>
      )}
    </>
  );
}
