import request from "../services/base";

const defaultState = {
  token: null,
  isAuth: false,
};

const auth = {
  namespaced: true,
  state: () => ({
    token: localStorage.getItem("token"),
    isAuth: !!localStorage.getItem("token"),
  }),
  actions: {
    login: (context, data) => {
      return request.post("auth/login", data).then((response) => {
        localStorage.setItem("token", response.data.data.token);
        context.commit("setdata", { token: response.data.data.token, isAuth: true });
        return response.data.data
      });
    },
    initAuth: (_, data) => {
      setdata(data);
    },
  },
  mutations: {
    setdata: (state, data) => {
      state = data;
    },
    resetData: (state) => {
      state = defaultState;
    },
  },
};

export default auth;
