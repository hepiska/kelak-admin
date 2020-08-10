import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../pages/Home.vue";
import Main from "../pages/main/main.vue";
import AdsCreate from "../pages/main/ads-create.vue";
import Ads from "../pages/main/ads.vue";
import User from "../pages/main/user.vue";
import Article from "../pages/main/article.vue";

import Page from "../pages/login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Main,
    children: [
      {
        path: "users",
        component: User,
      },
      {
        path: "articles",
        component: Article,
      },
      {
        path: "/ads",
        name: "Ads",
        component: Ads,
      },
      {
        path: "/ads/create",
        name: "AdsCreate",
        component: AdsCreate,
      },
    ],
  },
  {
    path: "/login",
    name: "Login-page",
    component: Page,
  },

  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../pages/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
