<template>
  <div>
    <v-app-bar app dense dark color="primary" height="64">
      <v-toolbar-title class="headline">Create Ads</v-toolbar-title>
    </v-app-bar>
    <v-card class="pa-8">
      <v-card-title class="headline">Create Ads</v-card-title>
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
              v-model="form.data.title"
              :rules="form.rules.title"
              label="Title"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-select
              :items="adsTypes"
              item-text="name"
              v-model="form.data.type"
              item-value="value"
              label="Type"
            ></v-select>
          </v-col>
          <v-col
            cols="6"
            v-if="form.data.type === 'category' || form.data.type === 'article'"
          >
            <vue-tags-input
              v-model="tag"
              :tags="form.data[form.data.type]"
              @tags-changed="update"
              :placeholder="tagPlaceholder"
              :autocomplete-items="tagAutoComplete"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="7">
            <v-text-field
              v-model="form.data.summary"
              :rules="form.rules.summary"
              label="Summary"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="5">
            <v-text-field
              v-model="form.data.refrence_url"
              :rules="form.rules.refrence_url"
              label="Ref URL"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col>
            <h3>Start At</h3>
            <v-date-picker
              v-model="form.data.start_at"
              :allowed-dates="startAtRule"
            ></v-date-picker>
          </v-col>
          <v-col>
            <h3>End At</h3>
            <v-date-picker
              v-model="form.data.end_at"
              :allowed-dates="endAtRule"
            ></v-date-picker>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="9">
            <v-card v-if="images.length" class="d-flex flex-row mb-6" flat tile>
              <v-row>
                <v-col cols="3" v-for="image in images" :key="image">
                  <v-card>
                    <v-img
                      :src="image"
                      aspect-ratio="1"
                      class="grey lighten-2"
                    />
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
            <v-card v-else>
              <v-card-title>no image selected</v-card-title>
            </v-card>
          </v-col>
          <v-col cols="1">
            <v-file-input
              label="File input"
              filled
              @change="onSelectedFile"
              prepend-icon="mdi-camera"
            ></v-file-input>
          </v-col>
        </v-row>
      </v-form>
      <Froala v-if="!loading" :value="content" @change="contentChange"></Froala>

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
import Froala from "../../components/organims/froalaEditor";
import Errordialog from "../../components/organims/error-dialog";
import VueTagsInput from "@johmun/vue-tags-input";

import { mapActions, mapState } from "vuex";
import { getBase64 } from "../../utils/helpers";
import dayjs from "dayjs";
const defaultData = {
  name: "",
  title: "",
  type: "",
  start_at: "",
  refrence_url: "",
  end_at: "",
  summary: "",
  images: [],
  category: [],
  article: [],
  primaryImage: 0,
  content: ""
};
export default {
  name: "CreateAds",
  components: { Froala, Errordialog, VueTagsInput },
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
          title: [v => !!v || "Title is required"],
          summary: [v => !!v || "Summary is required"],
          refrence_url: [v => !!v || "Ref Url is required"],
          start_at: [v => !!v || "Start is required"],
          end_at: [v => !!v || "End is required"]
        }
      }
    };
  },
  mounted() {
    if (this.$route.params._id) {
      this.loading = true;
      this.getAds(this.$route.params._id).then(data => {
        data.article = data.articles_show.map(_data => ({
          text: _data.name,
          value: _data._id
        }));
        data.category = data.categories_show.map(_data => ({
          text: _data.name,
          value: _data._id
        }));
        data.end_at = dayjs(data.end_at).format("YYYY-MM-DD");
        data.start_at = dayjs(data.start_at).format("YYYY-MM-DD");
        this.form.data = data;
        this.loading = false;

        this.content = this.form.data.content;
      });
    }
    this.gettypes();
  },

  methods: {
    async gettypes() {
      const res = await Request({ url: "ads/types" });
      this.adsTypes = res.data.data.adsTypes;
    },
    update(newTags) {
      this.tagAutoComplete = [];
      this.form.data[this.form.data.type] = newTags;
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

        reqData.end_at = dayjs(reqData.end_at)
          .endOf("day")
          .toJSON();
        reqData.start_at = dayjs(reqData.start_at)
          .startOf("day")
          .toJSON();

        reqData.categories_show = reqData.category?.map(_data => _data.value);
        reqData.articles_show = reqData.article?.map(_data => _data.value);
        // reqData.start_at = reqData.start_at.toISOString();
        // reqData.end_at = reqData.end_at.toISOString();

        if (this.$route.params._id) {
          this.editAds({ _id: this.$route.params._id, data: reqData })
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
          this.newAds(reqData)
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
    async onSelectedFile(file) {
      const base64file = await getBase64(file);
      const res = await Request({
        url: "/ads/upload/image",
        method: "POST",
        data: { file: base64file, fileName: file.name }
      });
      this.images = res.data.data.url;
    },
    contentChange(data) {
      this.content = data;
    },
    back() {
      this.$router.back();
    },
    getTags() {
      if (this.tag.length < 2) return;

      let self = this;

      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        Request({
          url: self.form.data.type === "category" ? "categories" : "articles",
          params: {
            skip: 0,
            limit: 6,
            search: `name-regex:${this.tag}`
          }
        })
          .then(res =>
            self.form.data.type === "category"
              ? res.data.data.categories.map(_dat => ({
                  text: _dat.name,
                  value: _dat._id
                }))
              : res.data.data.articles.map(_dat => ({
                  text: _dat.name,
                  value: _dat._id
                }))
          )
          .then(_dat => {
            this.tagAutoComplete = _dat;
          });
      }, 300);
    },
    clearSelectedtags() {
      this.form.data.category = [];
      this.form.data.article = [];
    },
    ...mapActions("ads", ["newAds", "editAds", "getAds"])
  },
  watch: {
    tag: "getTags"
    // "form.data.type": "clearSelectedtags"
  },
  computed: {
    images: {
      get: function() {
        return this.form.data.images;
      },
      set: function(images) {
        const newImages = [...this.form.data.images, images];
        this.form.data.images = newImages;
      },
      content: {
        get: function() {
          return this.form.data.images;
        },
        set: function(content) {
          this.form.data.content = content;
        }
      }
    },
    tagPlaceholder: {
      get: function() {
        switch (this.form.data.type) {
          case "category":
            return "select category";
          case "article":
            return "select article";
          default:
            return "";
        }
      }
    },
    content: {
      get: function() {
        return this.form.data.content;
      },
      set: function(content) {
        this.form.data.content = content;
      }
    }
  }
};
</script>
