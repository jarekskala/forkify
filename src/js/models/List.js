import uniqid from 'uniqid';

export default class List {
  constructor() {
    this.items = [];
  }

  addItem(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count: count,
      unit: unit,
      ingredient: ingredient
    }

    this.items.push(item);
    return item;
  }

  deleteItem(id) {
    const index = this.items.findIndex(current => current.id === id);
    // [2, 4, 8] splice(1, 2) => return 4-8 , original array is [2]
    // [2, 4, 8] slice(0,2 ) => return 2-4, original array is [2, 4]
    this.items.splice(index, 1);  // splice(what,howMany), splice odstraňuje nebo nehrazuje.
  }


      
  updateCount(id, newCount) { 
    this.items.find(current => {
      	if(current.id === id) {
          current.count = newCount;   
        } 
    });
  }
}
