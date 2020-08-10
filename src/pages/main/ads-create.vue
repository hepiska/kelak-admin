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
            <v-text-field v-model="form.data.name" :rules="form.rules.name" label="Name" required></v-text-field>
          </v-col>
          <v-col>
            <v-select
              :items="adsTypes"
              item-text="name"
              v-model="form.data.type"
              item-value="value"
              label="Type"
            ></v-select>
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
            <v-date-picker v-model="form.data.start_at"></v-date-picker>
          </v-col>
          <v-col>
            <h3>End At</h3>
            <v-date-picker v-model="form.data.end_at"></v-date-picker>
          </v-col>
        </v-row>

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

      <v-card-actions>
        <v-spacer></v-spacer>

        <div v-if="!loading">
          <v-btn color="green darken-1" text @click="back">Disagree</v-btn>
          <v-btn :disabled="!valid" color="green darken-1" text @click="submit">Agree</v-btn>
        </div>
        <v-progress-linear v-else indeterminate color="primary" class="mb-0"></v-progress-linear>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
// @ is an alias to /src
import Request from "../../services/base";
import { mapState } from "vuex";
import { getBase64 } from "../../utils/helpers";

export default {
  name: "CreateAds",
  data() {
    return {
      loading: false,
      adsTypes: [],
      form: {
        data: {
          name: "",
          title: "",
          type: "",
          start_at: "",
          refrence_url: "",
          end_at: "",
          summary: "",
          images: [],
          primaryImage: 0,
          content: ""
        },
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
    // this.dialog = this.isOpen;
    // if (this._id) {
    //   this.getArticle(this._id).then(data => {
    //     this.form.data = data;
    //   });
    // }
    this.gettypes();
  },
  methods: {
    async gettypes() {
      const res = await Request({ url: "ads/types" });
      this.adsTypes = res.data.data.adsTypes;
    },
    submit() {
      console.log("this.form.data ", this.form.data);
      if (this.valid) {
        this.loading = true;
        const reqData = { ...this.form.data };
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
    }
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
    content: {
      get: function() {
        return this.form.data.images;
      },
      set: function(content) {
        this.form.data.content = content;
      }
    }
  }
};
</script>
