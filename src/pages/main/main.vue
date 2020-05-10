<template>
  <v-app>
    <Sidebar></Sidebar>
    <!-- <v-app-bar app dense dark color="primary" height="68">
      <v-toolbar-title>Page title</v-toolbar-title>
    </v-app-bar> -->
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
// @ is an alias to /src
import { mapState } from "vuex";
import Sidebar from "../../components/organims/sidebar.vue";

export default {
  name: "Main",
  components: { Sidebar },
  computed: mapState({
    isAuth: (state) => state.auth.isAuth,
  }),

  mounted() {
    if (!this.isAuth) {
      this.$router.push("/login");
    }
  },
};
</script>
