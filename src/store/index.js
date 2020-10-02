import Vue from "vue";
import Vuex from "vuex";
import auth from "./auth";
import articles from "./articles";
import ads from "./ads";
import users from "./user";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    ads,
    articles,
    users
  },
});
