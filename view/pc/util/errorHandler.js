import context from "../app.js";

export default function(err) {
  if(err.status == 401) {
    localStorage.removeItem('worker');
    return context.$router.go("login")
  }
  if(err.status == 404) {
    return context.$message.error("==== 404 ====");
  }
  context.$message.error(err.response.data);
}