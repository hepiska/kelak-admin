<template>
  <div>
    <v-app-bar app dense dark color="primary" height="64">
      <v-toolbar-title class="headline">Create User</v-toolbar-title>
    </v-app-bar>
    <v-card class="pa-8">
      <v-card-title class="headline">Create User</v-card-title>
      <v-form v-model="valid" ref="form">
        <v-row>
          <v-col>
            <v-text-field
              v-model="form.data.name"
              :rules="form.rules.name"
              label="Name"
              required
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="form.data.email"
              :rules="form.rules.email"
              label="Email"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="form.data.phone_number"
              :rules="form.rules.phone_number"
              label="Phone Number"
              required
            ></v-text-field>
          </v-col>
          <v-col>
            <vue-tags-input
              v-model="tag"
              :tags="form.data.roles"
              @tags-changed="update"
              placeholder="Add Roles"
              :autocomplete-items="tags"
            />
          </v-col>
        </v-row>
      </v-form>

      <v-card-actions>
        <v-spacer></v-spacer>

        <div v-if="!loading">
          <v-btn color="green darken-1" text @click="back">Disagree</v-btn>
          <v-btn :disabled="!valid" color="green darken-1" text @click="submit"
            >Agree</v-btn
          >
        </div>
        <v-progress-linear
          v-else
          indeterminate
          color="primary"
          class="mb-0"
        ></v-progress-linear>
      </v-card-actions>
    </v-card>
    <Errordialog
      :isOpen="dialogOpen"
      @change="errorDialogsChange"
      title="Error"
      :message="errorMessage"
    ></Errordialog>
  </div>
</template>

<script>
// @ is an alias to /src
import Request from "../../services/base";
import Errordialog from "../../components/organims/error-dialog";
import VueTagsInput from "@johmun/vue-tags-input";
import { mapActions, mapState } from "vuex";
import { getBase64 } from "../../utils/helpers";
import dayjs from "dayjs";
const defaultData = {
  name: "",
  email: "",
  roles: [],
  phone_number: ""
};
export default {
  name: "CreateAds",
  components: { Errordialog, VueTagsInput },
  data() {
    return {
      loading: false,
      tags: [{ text: "asasasa", value: "sasas" }],
      tag: "",
      adsTypes: [],
      errorMessage: "",
      valid: false,
      dialogOpen: false,
      tagAutoComplete: [],
      form: {
        data: { ...defaultData },
        rules: {
          name: [v => !!v || "Name is required"],
          email: [v => !!v || "Email is required"],
          roles: [v => !!v || "Summary is required"],
          phone_number: [v => !!v || "Phone number is required"]
        }
      }
    };
  },
  mounted() {
    if (this.$route.params._id) {
      // this.loading = true;
      this.getUser(this.$route.params._id).then(data => {
        this.loading = false;
        this.form.data = { ...data };
        this.form.data.roles = data.roles.reduce((acc, _role) => {
          const role = this.tags.find(_tag => _tag.value === _role);
          if (role) {
            acc.push(role);
          }
          return acc;
        }, []);
      });
    }
    this.gettypes();
  },

  methods: {
    async gettypes() {
      const res = await Request({ url: "user/roles" });
      this.tags = res.data.data.userRoles.map(_dat => ({
        text: _dat.name,
        value: _dat.value
      }));
    },
    update(newTags) {
      this.form.data.roles = newTags;
    },
    errorDialogsChange(data) {
      this.dialogOpen = !this.dialogOpen;
    },
    endAtRule(val) {
      return this.form.data.start_at && this.form.data.start_at < val;
    },
    startAtRule(val) {
      if (!this.form.data.end_at) {
        return true;
      }
      return this.form.data.end_at > val;
    },
    submit() {
      const reqData = { ...this.form.data };
      if (this.valid) {
        this.loading = true;

        reqData.roles = reqData.roles?.map(_data => _data.value);
        // reqData.start_at = reqData.start_at.toISOString();
        // reqData.end_at = reqData.end_at.toISOString();

        if (this.$route.params._id) {
          this.editUser({ _id: this.$route.params._id, data: reqData })
            .then(data => {
              this.loading = false;
              this.form.data = defaultData;
              this.$router.back();
            })
            .catch(err => {
              this.loading = false;
              this.dialogOpen = true;
              this.errorMessage = err.response.data.data.message;
            });
        } else {
          this.newUser(reqData)
            .then(data => {
              this.loading = false;
              this.form.data = defaultData;
            })
            .catch(err => {
              this.loading = false;
              this.dialogOpen = true;
              this.errorMessage = err.response.data.data.message;
            });
          // this.
        }
      }
    },
    back() {
      this.$router.back();
    },
    ...mapActions("users", ["newUser", "editUser", "getUser"])
  },
  computed: {}
};
</script>
