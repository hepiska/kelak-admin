import request from "../services/base";

const defaultState = {
  token: null,
  isAuth: false,
};

const ads = {
  namespaced: true,
  state: () => ({
    data: [],
    total: 0,
    loading: false,
    active: null,
  }),
  actions: {
    newAds: (_, data) => {
      const filteredData = Object.keys(data).reduce((acc, _key) => {
        if (data[_key] !== '') {
          acc[_key] = data[_key];

        }
        return acc;
      }, {})
      return request.post("/ads", filteredData).then((res) => {
        return res.data.data;
      });
    },
    deleteAds: (_, _id) => {
      return request({
        url: `/ads/${_id}`,
        method: "DELETE",
      }).then((res) => {
        return res.data.data;
      });
    },
    editAds: (_, { _id, data }) => {
      return request({
        url: `/ads/${_id}`,
        data: { ...data },
        method: "PUT",
      }).then((res) => {
        return res.data.data;
      });
    },
    getAdses: (context, params) => {
      context.commit("changeLoading", true);
      return request({ url: "/ads", method: "GET", params: params }).then(
        (res) => {
          context.commit("pushAds", res.data.data.ads);
          context.commit("changetotal", res.data.data.total);
          context.commit("changeLoading", false);
          return res.data.data;
        }
      );
    },
    getAds: (context, id) => {
      context.commit("changeLoading", true);
      return request({
        url: "/ads/" + id,
        method: "GET",
      }).then((res) => {
        context.commit("changeLoading", false);
        context.commit("changetotal", res.data.data);

        return res.data.data;
      });
    },
  },
  mutations: {
    pushAds(state, articles) {
      state.data = articles;
    },
    setActive: (state, article) => {
      state.active = article;
    },
    changetotal(state, total) {
      state.total = total;
    },
    changeLoading(state, loading) {
      state.loading = loading;
    },
  },
};

export default ads;
