import Town from '../town/town.interface';
import townModel from '../town/town.model';

let townsCache: {[name: string]: Town} = {};

function getTown() {
  return townsCache;
}

function updateTown() {
  setTimeout(() => {
    townsCache = {};
    townModel.find().populate('villages').then(towns => {
      towns.forEach(v => {
        townsCache[v.name] = v;
      });
    });
  }, 2000);
}


updateTown();

export default {
  getTown,
  updateTown
};
