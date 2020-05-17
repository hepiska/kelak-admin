import request from "../services/base";

const defaultState = {
  token: null,
  isAuth: false,
};

const auth = {
  namespaced: true,
  state: () => ({
    data: [],
    total: 0,
    loading: false,
    active: null,
  }),
  actions: {
    newArticles: (_, data) => {
      return request.post("/articles", data).then((res) => {
        return res.data.data;
      });
    },
    getArticles: (context, params) => {
      context.commit("changeLoading", true);
      return request({ url: "/articles", method: "GET", params: params }).then(
        (res) => {
          context.commit("pushArticle", res.data.data.articles);
          context.commit("changeTotal", res.data.data.total);
          context.commit("changeLoading", false);

          return res.data.data;
        }
      );
    },
  },
  mutations: {
    pushArticle(state, articles) {
      state.data = articles;
    },
    changeTotal(state, total) {
      state.total = total;
    },
    changeLoading(state, loading) {
      state.loading = loading;
    },
  },
};

export default auth;
