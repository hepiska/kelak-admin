<template>
  <v-row justify="center">
    <v-dialog
      v-model="isOpen"
      persistent
      min-height="700"
      scrollable
      @click:outside="closeModal"
    >
      <v-card>
        <v-card-title class="headline">
          {{ modalTitle }} User
        </v-card-title>

        <v-card-text style="height: 30vh;">
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-text-field
              v-model="form.data.name"
              :rules="form.rules.name"
              label="Name"
              required
            />
          </v-form>
          <v-row>
            <v-col>
              <v-text-field
                v-model="form.data.email"
                :rules="form.rules.email"
                label="Email"
                required
              />
            </v-col>
            <v-col>
              <v-select
                v-model="form.data.roles"
                flat
                hide-details
                :items="rolesOptions"
                label="Roles"
                item-text="roles"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />

          <div v-if="!loading">
            <v-btn
              color="black"
              text
              @click="closeModal"
            >
              Cancel
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click="submit"
            >
              {{ modalTitle }}
            </v-btn>
          </div>
          <v-progress-linear
            v-else
            indeterminate
            color="primary"
            class="mb-0"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import Request from "../../services/base";
import { getBase64 } from "../../utils/helpers";
import Froala from "./froalaEditor";
import VueTagsInput from "@johmun/vue-tags-input";
import { mapActions, mapState } from "vuex";

export default {
  props: ["isOpen", "_id"],
  data: () => ({
    loading: false,
    modalTitle: 'Create',
    rolesOptions: [
      'admin',
      'manager'
    ],
    valid: false,
    form: {
      data: {
        name: "",
        email: "",
        roles: [],
      },
      rules: {
        name: [v => !!v || "Name is required"],
        email: [v => !!v || "Email is required"],
      },
    },
  }),
  mounted() {
    if (this._id) {
      this.modalTitle = 'Edit'
      this.getUser(this._id).then(data => {
        this.form.data = data;
      });
    }
  },
  methods: {
    closeModal() {
      this.$emit("changeModal");
    },
    submit() {
      if (this.valid) {
        this.loading = true
        const reqData = { ...this.form.data }
        if (typeof reqData.roles === 'string') {
          reqData.roles = [reqData.roles]
        }
        
        if (this._id) {
          this.editUsers({ _id: this._id, data: reqData}).then(() => {
            this.loading = false
            this.closeModal()
          })
        } else {
          this.createUsers(reqData).then(() => {
            this.loading = false
            this.closeModal()
          })
        }
      }

    },
    ...mapActions("users", ["createUsers", "editUsers", "getUser"])
  }
};
</script>
