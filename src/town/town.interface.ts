import Villages from '../village/village.interface';

export default interface Town {
  _id: string;
  // 镇名
  name: string;
  // 镇下面的村
  villages?: Villages[];
}
