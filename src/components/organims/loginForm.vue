<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field v-model="email" :rules="emailRules" label="E-mail" required />
    <v-text-field
      v-model="password"
      :counter="10"
      :rules="passwordRules"
      label="Password"
      type="password"
      required
    />

    <v-btn :disabled="!valid" color="success" class="my-3" @click="validate">
      Login
    </v-btn>
  </v-form>
</template>

// @vue/component
<script>
import request from "../../services/base";
import { mapActions, mapState } from "vuex";

export default {
  data: () => ({
    valid: true,
    password: "",
    passwordRules: [v => !!v || "Password is required"],
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ]
  }),

  computed: {
    ...mapState({
      isAuth: state => state.auth.isAuth
    })
  },

  mounted() {
    if (this.isAuth) {
      this.$router.replace("/");
    }
  },

  methods: {
    validate() {
      this.$refs.form.validate();
      const self = this;
      if (this.valid) {
        this.login({ email: this.email, password: this.password }).then(() => {
          window.location = "/";
        });
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    ...mapActions("auth", ["login"])
  }
};
</script>
