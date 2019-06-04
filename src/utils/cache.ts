import Town from '../town/town.interface';
import townModel from '../town/town.model';

let townsCache: {[name: string]: Town} = {};

function getTown() {
  return townsCache;
}

function updateTown() {
  townsCache = {};
  townModel.find().populate('villages').then(towns => {
    towns.forEach(v => {
      townsCache[v.name] = v;
    });
  });
}


updateTown();

export default {
  getTown,
  updateTown
};
