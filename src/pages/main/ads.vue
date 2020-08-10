<template>
  <div>
    <v-app-bar app dense dark color="primary" height="64">
      <v-toolbar-title class="headline">Ads</v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link :to="{name:'AdsCreate'}">
        <v-btn icon>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </router-link>
    </v-app-bar>

    <v-data-iterator :items="articles" hide-default-footer :loading="loading">
      <template v-slot:header>
        <v-toolbar class="mb-2" color="primary" dark flat>
          <v-text-field v-model="search" clearable flat solo-inverted hide-details label="Search"></v-text-field>
          <v-spacer></v-spacer>
          <v-select
            flat
            v-model="sortBy"
            solo-inverted
            hide-details
            :items="sortOptions"
            label="Sort by"
            item-text="title"
          ></v-select>
        </v-toolbar>
      </template>
      <template>
        <v-row>
          <v-col v-for="article in articles" :key="article._id" cols="12" sm="6" md="4">
            <v-card class="mx-auto" max-width="400">
              <v-img
                class="white--text align-end"
                height="200px"
                :src="article.images[article.primaryImage || 0]"
              >
                <v-card-title>{{article.title}}</v-card-title>
              </v-img>

              <v-card-subtitle class="pb-0">{{article.title}}</v-card-subtitle>

              <v-card-text class="text--primary">
                <div>{{article.summary}}</div>
              </v-card-text>

              <v-card-actions>
                <v-btn color="orange" @click="openEdit(article._id)" text>Edit</v-btn>

                <v-btn color="orange" @click="initiatedelete(article._id)" text>Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </template>
      <template v-slot:footer>
        <v-row class="mt-2" align="center" justify="center">
          <v-spacer></v-spacer>

          <span class="mr-4 grey--text">Page {{ skip+1 }} of {{ totalPage }}</span>
          <v-btn fab dark color="blue darken-3" class="mr-1" @click="formerPage">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab dark color="blue darken-3" class="ml-1" @click="nextPage">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from "vuex";

export default {
  name: "Ads",
  data: () => ({
    isModalOpen: false,
    confirmModal: false,
    selectedId: null,
    sortBy: "created_at:desc",
    limit: 6,
    skip: 0,
    sortOptions: [
      { title: "Title Asc", value: "title:asc" },
      { title: "Title Desc", value: "title:desc" },
      { title: "Created At Desc", value: "created_at:desc" },
      { title: "Created At Asc", value: "created_at:asc" }
    ],
    search: "",
    ads: []
  })
};
</script>
