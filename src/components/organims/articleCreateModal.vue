<template>
  <v-row justify="center">
    <v-dialog v-model="isOpen" persistent min-height="700" @click:outside="closeModal" scrollable>
      <v-card>
        <v-card-title class="headline">Create Article</v-card-title>
        <v-card-text style="height: 70vh;">
          <v-form v-model="valid" ref="form">
            <!-- <v-container> -->
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
                <v-select
                  :items="articleTypes"
                  item-text="name"
                  v-model="form.data.type"
                  item-value="value"
                  label="Type"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="form.data.title"
                  :rules="form.rules.title"
                  label="Title"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-checkbox v-model="form.data.isHeadline" label="Headline"></v-checkbox>
              </v-col>
              <v-col>
                <vue-tags-input
                  v-model="newCategory"
                  :tags="form.data.category"
                  @before-adding-tag="addCategory"
                  @tags-changed="update"
                  placeholder="add category"
                  :autocomplete-items="categoryAutoComplete"
                />
              </v-col>
            </v-row>

            <v-text-field
              v-model="form.data.summary"
              :rules="form.rules.summary"
              label="Summary"
              required
            ></v-text-field>
            <v-row>
              <v-col cols="9">
                <v-card v-if="images.length" class="d-flex flex-row mb-6" flat tile>
                  <v-row>
                    <v-col cols="3" v-for="image in images" :key="image">
                      <v-card>
                        <v-img :src="image" aspect-ratio="1" class="grey lighten-2" />
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
          <Froala :content="content" @change="contentChange"></Froala>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <div v-if="!loading">
            <v-btn color="red darken-1" text @click="closeModal">Disagree</v-btn>
            <v-btn :disabled="!valid" color="green darken-1" text @click="submit">Agree</v-btn>
          </div>
          <v-progress-linear v-else indeterminate color="primary" class="mb-0"></v-progress-linear>
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
  data() {
    return {
      newCategory: "",
      dialog: false,
      valid: false,
      categoryAutoComplete: [],
      articleTypes: [],
      debounce: null,
      loading: false,
      form: {
        data: {
          name: "",
          title: "",
          type: "",
          category: [],
          isHeadline: false,
          summary: "",
          images: [],
          primaryImage: 0,
          content: ""
        },
        rules: {
          name: [v => !!v || "Name is required"],
          title: [v => !!v || "Title is required"],
          summary: [v => !!v || "Summary is required"]
        }
      }
    };
  },
  mounted() {
    this.dialog = this.isOpen;
    if (this._id) {
      this.getArticle(this._id).then(data => {
        this.form.data = data;
      });
    }
    this.gettypes();
  },
  watch: {
    newCategory: "initItems"
  },
  components: { Froala, VueTagsInput },
  props: ["isOpen", "_id"],
  computed: {
    images: {
      get: function() {
        return this.form.data.images;
      },
      set: function(images) {
        const newImages = [...this.form.data.images, images];
        this.form.data.images = newImages;
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
  },
  methods: {
    closeModal() {
      this.$emit("changemodal");
    },
    update(newTags) {
      this.categoryAutoComplete = [];
      this.form.data.category = newTags;
    },
    async addCategory({ tag, addTag }) {
      if (tag.value) {
        addTag(tag);
        return "";
      }

      const res = await Request({
        url: "/categories",
        method: "POST",
        data: { name: tag.text }
      }).then(_res => ({
        value: _res.data.data.category._id,
        text: _res.data.data.category.name
      }));
      // const newCategories = [...this.form.data.category, res];
      // this.form.data.category = newCategories;
      this.newCategory = "";
      tag.value = res.value;
      addTag(tag);
      return "";
    },
    async gettypes() {
      const res = await Request({ url: "articles/types" });
      this.articleTypes = res.data.data.articleTypes;
    },
    contentChange(data) {
      this.content = data;
    },
    submit() {
      const reqData = { ...this.form.data };
      if (this.valid) {
        this.loading = true;
        const reqData = { ...this.form.data };
        reqData.categories = reqData.category
          ? reqData.category.map(_cat => _cat.value)
          : [];
        if (this._id) {
          this.editArticles({ _id: this._id, data: reqData }).then(() => {
            this.loading = false;
            this.closeModal();
          });
        } else {
          this.newArticles(reqData).then(() => {
            this.loading = false;
            this.closeModal();
          });
        }
      }
    },
    async onSelectedFile(file) {
      const base64file = await getBase64(file);
      const res = await Request({
        url: "/articles/upload/image",
        method: "POST",
        data: { file: base64file, fileName: file.name }
      });
      this.images = res.data.data.url;
    },

    initItems() {
      if (this.newCategory.length < 2) return;

      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        Request({
          url: "categories",
          params: {
            skip: 0,
            limit: 6,
            search: `name-regex:${this.newCategory}`
          }
        })
          .then(res =>
            res.data.data.categories.map(_dat => ({
              text: _dat.name,
              value: _dat._id
            }))
          )
          .then(_dat => {
            this.categoryAutoComplete = _dat;
          });
      }, 300);
    },
    ...mapActions("articles", ["newArticles", "editArticles", "getArticle"])
  }
};
</script>
