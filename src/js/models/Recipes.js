 import axios from 'axios';

/** CLASS **/
export default class Recipe {

  constructor(id) {
    this.id = id;
  }

  async getRecipe()  {
    try {
      const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
      // console.log(res.data.recipe);
      this.result = res.data.recipe;

      this.title = this.result.title;
      this.author = this.result.publisher;
      this.image = this.result.image_url;
      this.url = this.result.source_url;
      this.ingredients = this.result.ingredients;
    } catch (error){
      console.log(error);
      alert('Something went wrong :( )');
    }
  }

  calcTime() {                                                                  // Spočti dobu přípravy.
    // assuming that we need 15 minuts for 3 ingredients.
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time =  periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  // Zpracování a změny v ingrediencích.
  parseIngredients() {
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'  ];
    const unitsShort = ['tbs', 'tbs', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
    const units = [...unitsShort, 'kg', 'g'];                                   // Spread rozbije unitsShort na string. => 'tbs', 'tbs', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound','kg','g'


    const newIgredients = this.ingredients.map((current) => {
      // 1. Uniform units
      let ingredient = current.toLowerCase();                                   // do proměnné pokaždé pošleš aktuální current element. + ho zmenšíš.

      unitsLong.forEach((current, index) => {
        ingredient = ingredient.replace(current, unitsShort[index]);            // pokud metoda replace najde current element ve stringu ingredient, tak ho přepíše chtěným unitsShort na stejném indexu.
      });

      // 2. Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');                                 // regular expression => odstraníš závorky z daného stringu.

      // 3. Parse ingredients into count, unit and ingredients
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex((current2) => units.includes(current2)); // findIndex je cyklus. includes je ES7 metoda.

      let objIng;

      if(unitIndex > -1) {
        // There is a unit
        // př: 4 1/2 cups, arrCount = [4, 1/2]
        // př: 4 cups, arrCount = [4]
        const arrCount = arrIng.slice(0, unitIndex);

        let count;
        if(arrCount.length === 1) {
          count = eval(arrCount[0].replace('-','+'));
        }else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }

        objIng = {
          count: count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex+1).join(' ')
        };

      } else if (parseInt(arrIng[0], 10)) {                                     // Ve stringu převedeného na pole počítáme že number bude na 0 místě. Snažíme se parseInt("5") např.... Pokud bude parseInt("string jakykoliv") vyhodí to false.
        // There is no unit, but first element is number.
        objIng = {
          count: parseInt(arrIng[0], 10),                                       // Tohle číslo si bereš z puvodní věty rozsekané do pole na 0tem indexu + menis na cislo.
          unit: 'here baby',
          ingredient: arrIng.slice(1).join(' ')                                // slice(1) znamená začni na indexu od 1 do konce pole. Join(' ') spojuje pole zase zpátky do stringu pomocí mezery. ' '
        }
      } else if(unitIndex === -1) {
        // There is no unit
        objIng = {
          count: 1,
          unit: "baby",
          ingredient: ingredient                                                // přiřazení variable ze shora.
        }                   
      }
              

      return objIng;                                                        // Vyprdne 1ks ingredient, který uloží jako 0tý index do nového pole metody map(); Tohle je tedy 1ks iterace map() a pokracuje dokud neudelá celou delku originalniho pole.
    })

    this.ingredients = newIgredients;                                           // newIgredients je už nové pole z metody map() , které se přířadí do objectu this.ingredients.
  }

  updateServings(type) {                                  // type increase od decrease
    // Update servings
    let newServings =  type === 'dec' ? this.servings - 1 : this.servings + 1;


    // update ingredients
    this.ingredients.forEach(current => {
      current.count *= (newServings / this.servings);           // new servings / old servings.
 
      if(current.count % 1 != 0)  { 
        current.count = current.count.toFixed(4);  
      } 
        
    })

    this.servings = newServings;
  }
}
