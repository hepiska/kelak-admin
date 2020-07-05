import request from "../services/base";

const auth = {
  namespaced: true,
  state: () => ({
    data: [],
    total: 0,
    loading: false,
    active: null,
  }),
  actions: {
    createUsers: (_, data) => {
      return request.post("/user", data).then((res) => {
        return res.data.data;
      });
    },
    editUsers: (_, { _id, data }) => {
      return request({
        url: `/user/${_id}`,
        data: { ...data },
        method: "PUT",
      }).then((res) => {
        return res.data.data;
      });
    },
    deleteUsers: (_, _id) => {
      return request({
        url: `/user/${_id}`,
        method: "DELETE",
      }).then((res) => {
        return res.data.data;
      });
    },
    getUsers: (context, params) => {
      context.commit("changeLoading", true);
      return request({ url: "/user", method: "GET", params: params }).then(
        (res) => {
          context.commit("pushUsers", res.data.data.users);
          context.commit("changeTotal", res.data.data.total);
          context.commit("changeLoading", false);

          return res.data.data;
        }
      );
    },
    getUser: (context, id) => {
      context.commit("changeLoading", true);
      return request({
        url: "/user/" + id,
        method: "GET",
      }).then((res) => {
        context.commit("changeLoading", false);
        return res.data.data;
      });
    },
  },
  mutations: {
    pushUsers(state, users) {
      state.data = users;
    },
    setActive: (state, user) => {
      state.active = user;
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
