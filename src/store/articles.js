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

      const filteredData = Object.keys(data).reduce((acc, _key) => {
        if (data[_key] !== '') {
          acc[_key] = data[_key];

        }
        return acc;
      }, {})

      return request.post("/articles", filteredData).then((res) => {
        return res.data.data;
      });
    },
    deleteArticles: (_, _id) => {
      return request({
        url: `/articles/${_id}`,
        method: "DELETE",
      }).then((res) => {
        return res.data.data;
      });
    },
    editArticles: (_, { _id, data }) => {
      return request({
        url: `/articles/${_id}`,
        data: { ...data },
        method: "PUT",
      }).then((res) => {
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
    getArticle: (context, id) => {
      context.commit("changeLoading", true);
      return request({
        url: "/articles/" + id,
        method: "GET",
      }).then((res) => {
        context.commit("changeLoading", false);
        context.commit("changeTotal", res.data.data);

        return res.data.data;
      });
    },
  },
  mutations: {
    pushArticle(state, articles) {
      state.data = articles;
    },
    setActive: (state, article) => {
      state.active = article;
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
