import Search from './models/Search';
import Recipe from './models/Recipes';
import List from './models/List';
import * as searchView from './views/searchView';                               //  export vše jako object se jmenem searchView
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likesView';
import {elements,renderLoader,clearLoader} from './views/base';
import Likes from './models/Likes';



/** Global state of the app
* - Search object
* - Cuttent recipe object
* - Shopping list object
* - Liked recipes
* -
*/
const state = {};                                                               // databaze
window.state = state; 

/*SEARCH CONTROLLER*/
const controlSearch = async () => {
  // 1) Get query from the view
    const query = searchView.getInput();                                        // query ze searche, např. po zadání "pizza"

    // // testing - puvodni je radek zakomentovany nad timto radkem.
    // const query = 'pizza';

  if(query) {
    // 2) New search object  and add to state
    state.search = new Search(query);                                             // zakládám nový properities doposud prázdného vyse definovaneho objectu state a plním ho objectem z constructoru.

    // 3) Prepare UI for results                                                 TO DO
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.result);

    try {
      // 4) Search for recipes
      await state.search.getResult();

      clearLoader();

      // 5) Render results to UI
      // renderResults(state.search.result);
      searchView.renderResults(state.search.result);
    } catch(error) {
      console.log('Someething is wrong with the searcher !');
      clearLoader();
    }


  }
}


elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});


//testing - po skonceni testu celé smaž
// window.addEventListener('load', e => {
//   e.preventDefault();
//   controlSearch();
// });
// END - po skonceni testu celé smaž



//#Event ploštice na element, který není součástí načtené stránky
elements.resultPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');                                  // event.target říká, že ber element který určíš metodou closest() z targetovaneho mista smerem nahoru. (probublavánie..)
  if(btn) {
      const goToPage = parseInt(btn.dataset.goto, 10);                          // 10 rika jen 10ková soustava
      searchView.clearResults();
      searchView.renderResults(state.search.result, goToPage);
  }

});



/*RECIPE CONTROLLER
* Kontroluje recepty kliknuté z levého sloupce po kliknutí.
*/

const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');                             // [#] window.location.hash, získá URL. [#] replace()
  // console.log(id);

  if(id) {                                                                      // pokud ID existuje.

    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight selected search item
    if(state.search)  {
      searchView.highlightSelected(id);
    }


    // Create new recipe object
    state.recipe = new Recipe(id);

    // // testing
    // window.r = state.recipe;                                                      // Press r, if is state.recipe filled.

    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();                                           // Přidá/uloží z metody getRecipe() vytvořené vlastnosti do patřičného objectu state.recipe
      state.recipe.parseIngredients();
      // Calculate servings and time
      state.recipe.calcTime();                                                   // Přidá/uloží z metody getRecipe() vytvořené vlastnosti do patřičného objectu state.recipe
      state.recipe.calcServings();                                                 // Přidá/uloží z metody getRecipe() vytvořené vlastnosti do patřičného objectu state.recipe

      // Render recipe and celar loader.
      // console.log(state.recipe);
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id)); 


    } catch (error) {
        console.log(error); 
        alert('Error processing recipe ! ');
    }

  }
};

// window.addEventListener('hashchange', controlRecipe);                           //#event on #hash change
// window.addEventListener('load', controlRecipe);                                 // # event na reload stránky, tedy i při prvním loadu.

/*#2 eventy nacpi do jednoho addEventListener*/
['hashchange','load'].forEach( (event) => window.addEventListener(event, controlRecipe));


/*
* LIST CONTROLLER
* kontroluje shopping list.
*/

const controlList = () => {
  // create a new list if there in none yet
  if(!state.list) state.list  = new List();

  // add each ingredient to the LIST and UI
  state.recipe.ingredients.forEach(current => {
    const item = state.list.addItem(current.count, current.unit, current.ingredient); // ukládáme do const item, protože funkce addItem má definici s returnutím itemu.
    listView.renderItem(item); 
  });
}


/** Handle delete and update list item events */
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  // console.log(id);
  
  //Handle the delete button
  if(e.target.matches('.shopping__delete, .shopping__delete *')) { 
    //delete from state
    state.list.deleteItem(id);

    // delete from UI
    listView.deleteItem(id);        
    
    console.log('deleted from state and from UI');
  } else if(e.target.matches('.shopping__count--value')) { 
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);  
    // console.log(val);   
  }
});


/* 
*LIKE CONTROLLER 
*/

const controlLike = () => {
  if(!state.likes) state.likes = new Likes();
  
  const currentID = state.recipe.id; 
  
  // User has NOT like current recipe
  if(!state.likes.isLiked(currentID)) {

      // Add like to the state
      const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.image); 

      // Toggle the like button
      likeView.toggleLikeBtn(true);  
 
      // Add like to UI list
      likeView.renderLike(newLike); // new like proměnná ukládá volání funkce, a ta funkce returne její výsledek.   
      console.log(state.likes);    

  // User HAS like current recipe
  } else {
      // Remove like to the state 
      state.likes.deleteLike(currentID);

      // Toggle the like button
      likeView.toggleLikeBtn(false);
        

      // Remove like to UI list
      console.log(state.likes); 
      likeView.deleteLike(currentID); 
  }  

  likeView.toggleLikeMenu(state.likes.getNumLikes());
}


// Restore Like Recipes on page loads.
window.addEventListener('load', () => {
  state.likes = new Likes(); 
  // Restore likes 
  state.likes.readStorage();
  // toggle like menu button 
  likeView.toggleLikeMenu(state.likes.getNumLikes());  

  // render all likes recipes if some are in local storage
  state.likes.likes.forEach(current => likeView.renderLike(current)); 
});


//#Event ploštice na elementy, který není součástí načtené stránky
// handling recipe button clicks.
elements.recipe.addEventListener('click', e => {
  if(e.target.matches('.btn-decrease, .btn-decrease *')) {                      /*.btn-decrease *, ta * znamená cokoliv uvnitř elementu .btn-decrease, protoze muzes kliknout treba na svg.   */
    // decrase button is clicked, but caution for negative values.
    if(state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
    }

  } else if(e.target.matches('.btn-increase, .btn-increase *')) {
    // increase button is clicked
    state.recipe.updateServings('inc');

  } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // add ingredients to shopping list
    controlList();
  } else if(e.target.matches('recipe__love, .recipe__love *')) {
    // Like Controller
    controlLike(); 
  }

  // Prepare UI

  // console.log(state.recipe);
  recipeView.updateServingsIngredients(state.recipe);
});


// const search = new Search('pizza');
// search.getResult();
// console.log(search);

window.l = new List();
