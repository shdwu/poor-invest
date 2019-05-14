import Town from '../town/town.interface';

export default interface Village {
  _id: string;
  town: Town;
  // 村名
  name: string;
}
