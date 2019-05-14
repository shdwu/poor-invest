import Town from '../town/town.interface';
import townModel from '../town/town.model';

let townsCache: {[name: string]: Town};

function initializeTown() {
  townModel.find().then(towns => {
    towns.forEach(v => {
      const item: any = {};
      item.name = v.name;
      item.value = v;
      this.towns.push(item);
    });
  });
}

function updateTown() {
  townsCache = {};
  townModel.find().then(towns => {
    towns.forEach(v => {
      townsCache[v.name] = v;
    });
  });
}


initializeTown();

export default {
  townsCache,
  updateTown
};
