import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    title: "login",
    worker: false
  },
  mutations: {
    setTitle(state, title) {
      state.title = title;
    },
    setWorker(state, worker) {
      state.worker = worker;
    }
  },
  actions: {
    getWorkerAsync() {
      setInterval(() => {
        axios.get("/current",(res) => {
          localStorage.worker = res.data;
          store.commit('setWorker', res.data);
        })
      }, 10000)
    }
  }
});

if(localStorage.worker) {
  store.commit('setWorker', JSON.parse(localStorage.worker))
}

store.dispatch("getWorkerAsync");

export default store;