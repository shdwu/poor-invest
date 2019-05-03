export default function(propName: string, msg: string) {
  const ret: any = {};
  ret[propName] = [{msg}];
  return ret;
}
