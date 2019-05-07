import context from "../app.js";

export default function(err) {
  if(err.response.status == 401) {
    localStorage.removeItem('worker');
    context.$store.commit("setWorker", false);
    return context.$router.go("login")
  }
  if(err.response.status == 404) {
    return context.$message.error("==== 404 ====");
  }
  context.$message.error(err.response.data);
}