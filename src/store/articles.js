import request from "../services/base";

const defaultState = {
  token: null,
  isAuth: false,
};

const auth = {
  namespaced: true,
  state: () => ({
    articles: [],
    active: null,
  }),
  actions: {
    login: (_, data) => {
      request.post("auth/login", data).then((response) => {
        localStorage.setItem("token", response.data.data.token);
        commit("setdata", { token: response.data.data.token, isAuth: true });
      });
    },
    newArticles: (_, data) => {
      request.post("/articles", data).then((res) => {
        return res.data.data;
      });
    },
  },
  mutations: {},
};

export default auth;
