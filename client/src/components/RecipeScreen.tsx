import * as React from 'react';
import { useState } from 'react';
//import * as client from '../RecipeServerClient';
import './RecipeScreen.css';

export default function RecipeScreen() {
  const [modal, setModal] = useState(false); //this hook will be used to toggle the modal window
  const toggleModal = () => setModal(!modal);

  return (
    <>
      <button onClick={toggleModal} className="btn-modal">
        Add Recipe
      </button>
      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay" /> //clicking on the overlay will close the modal
          <div className="modal-content">
            {' '}
            //Todo: what is this modal-content
            <h2>Hello, please enter your recipe below</h2>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestiae, saepe dolore excepturi praesentium
              laborum architecto, ratione deserunt consequuntur facilis odio molestias eveniet corporis iure tempore
              provident distinctio! Optio deleniti quibusdam asperiores perferendis nesciunt odio sapiente. Veritatis
              commodi quam deserunt doloribus tempora magni, consectetur molestiae velit ut, dolorum deleniti dicta
              porro?
            </p>
            <button className="close-modal" onClick={toggleModal}>
              Close this window
            </button>
          </div>
        </div>
      )}
    </>
  );
}
