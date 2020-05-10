<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1>home</h1>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from "vuex";

export default {
  name: "Home",
  components: {},
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
