import {elements} from './base';

export const getInput = () =>  elements.searchInput.value;                      // 1 arrow function řádek automaticky returne do proměnné getIpnut value.

export const clearInput = () => elements.searchInput.value = '';

export const clearResults = () => {
  elements.resultList.innerHTML  = '';
};

export const highlightSelected = id => {
  const resultsArray =  Array.from(document.querySelectorAll('.results__link'));                // vyrob array z results link
  resultsArray.forEach(current => {
    current.classList.remove('results__link--active'); 
  })

  let element = document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
}



// lokální funkce pro zkrácení titlu receptu, které mají víc než 17 znaků.
// Zakončíme takovýto title 3mi tečkami ... na konci
/*START #reduce 1, #split 1*/

const limitRecipeTitle = (title, limit = 17) => {                               // limit je defaultní nastavení
  const newTitle = [];

  if(title.length > limit) {                                                    // title.length spočítá písmena a mezery dohromady.

    title.split(' ').reduce((accumulator,current) => {                          // title.split(' ') rozbije větu do pole po slovech 'slovo', 'slovo'..... reduce() prochází polem v cyklu. Vidí stále accumulator a current.
      if(accumulator + current.length <= limit) {                               // dole si vždy returneš aktualní accumulator.
        newTitle.push(current);
      }
      return accumulator + current.length;                                      // Aby mohl reduce dobře a spravně cyklovat, tak musíš returnout accumulator + current, který se automaticky uloží do acunzkator v příštím kole iterace.
    }, 0);                                                                      // 0 je default .. od které začíná počítat iteraci. V první iteraci to nastaví pro accumulator = 0;

    return `${newTitle.join(' ')} ...` ;                                        // join(' ') spojuje pole do věty s mezerou. Je to opak split()... pokud se provede tento return, ten dalsi za timhle se preskoci. Jinymi slovy tento return zajisti výskok z celé funkce limitRecipeTitle
  }

  return title;                                                                 // V případě že se nesplní podmínka výše, se bez změny čehokoliv vyreturne tento puvodni title, který byl narvaný do této konkretní funkce.
};
/*END #reduce 1, #split 1*/


const renderOneRecipe = oneRecipe => {
  const singleItem = `
  <li>
      <a class="results__link" href="#${oneRecipe.recipe_id}">
          <figure class="results__fig">
              <img src="${oneRecipe.image_url}" alt="${oneRecipe.title}">
          </figure>
          <div class="results__data">
              <h4 class="results__name">${limitRecipeTitle(oneRecipe.title)}</h4>
              <p class="results__author">${oneRecipe.publisher}</p>
          </div>
      </a>
  </li>
  `;
  elements.resultList.insertAdjacentHTML('beforeend', singleItem);
};

// START #Paginátor - stránkování
// 30 produktu
//   0 - 9
//   10 - 19
//   20 - 29
// 3 stranky po 10

const createButton = (type, page) => {
  return `
  <button class="btn-inline results__btn--${type}" data-goto = "${type === 'next' ? page + 1 : page - 1}">
      <span>Page ${type === 'next' ? page + 1 : page - 1 }</span>
      <svg class="search__icon">
          <use href="img/icons.svg#icon-triangle-${type === 'next' ? 'right' : 'left'}"></use>
      </svg>
  </button>
  `
}

const renderButtons = (page, numOfResults, resPerPage) => {
  const sumOfpages = Math.ceil(numOfResults / resPerPage);                      // ceil => funkce pro zaokrouhlení vzdy nahoru.

  let button;
  if(page === 1 && sumOfpages > 1 ) {
    // Only button to go to next page
    button = createButton('next', page);
    // console.log(button);
  } else if(page < sumOfpages && page > 1) {
    // both buttons (next and prev)
    button = `${createButton('prev', page)} ${createButton('next', page)} `;
  }
  else if(page === sumOfpages && sumOfpages > 1) {
    // Only button to go to prev page
    button = createButton('prev', page);
  }

  elements.resultPages.insertAdjacentHTML('beforeend', button);
}

const clearButtons =() => {
  elements.resultPages.innerHTML = "";
}

export const renderResults = (allRecipes, page = 1, resPerPage = 10) => {
  // Render results for current page
    const start = (page - 1) * resPerPage ;
    const end = page * resPerPage;
    allRecipes.slice(start, end).forEach(el => renderOneRecipe(el));            // slice() je 0 based. End uz nevlozi - tzn. slice(0,10) => 0 - 9
    clearButtons();

    // render buttons
    renderButtons(page, allRecipes.length, resPerPage);
};
// END #Paginátor - stránkování
