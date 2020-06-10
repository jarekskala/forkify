import axios from 'axios';                                                                                  //zde netřeba uvádět přesnou path. Načítáme si tím nainstalovaný NPM modul.Axios je lepší náhrada za fetch();

/** CLASS **/
export default class Search {

    constructor(query) {
        this.query = query;
    }

    async getResult() {                                                                                                 // vytvoření prototype.property.
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);    // res znamená result...  náhrada ze fetch(), automatický returne json.  
            this.result = res.data.recipes;                                       // tohle je na místo kdysi používaného "returnutí".. takto se to zapouzdří do objectu ten výsledek.
            // console.log(this.result);
        }
        catch(error) {
          alert('Nenazalezno');
        }
    }                                                                           // automaticky returne promise, na které se dá použít await();

}
