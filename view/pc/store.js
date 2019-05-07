import Vue from "vue";
import Vuex from "vuex";

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
  }
});

if(localStorage.worker) {
  store.commit('setWorker', JSON.parse(localStorage.worker))
}

export default store;