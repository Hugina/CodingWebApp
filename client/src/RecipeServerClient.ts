import Recipe from './model/Recipe';

const DUMMPY_RECIPE: Recipe = {
    id: 1,
    name: 'Dummy Recipe'
    //ingredients: 
}

const getRecipes: () => Recipe[] = () => {
    return [DUMMPY_RECIPE];
}


export default getRecipes;