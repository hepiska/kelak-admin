<template>
  <div>
    <v-app-bar app dense dark color="primary" height="64">
      <v-toolbar-title class="headline">Ads</v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link :to="{ name: 'AdsCreate' }">
        <v-btn icon>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </router-link>
    </v-app-bar>

    <v-data-iterator :items="adses" hide-default-footer :loading="loading">
      <template v-slot:header>
        <v-toolbar class="mb-2" color="primary" dark flat>
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            label="Search"
          ></v-text-field>
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
          <v-btn
            v-for="status in statuses"
            :key="status.value"
            @click="selectedStatus = status.value"
            class="ma-2"
            outlined
            :color="selectedStatus === status.value ? 'indigo' : 'gray'"
            >{{ status.name }}</v-btn
          >
        </v-row>
        <v-row>
          <v-col v-for="ads in adses" :key="ads._id" cols="12" sm="6" md="4">
            <v-card class="mx-auto" max-width="400">
              <v-img
                class="white--text align-end"
                height="200px"
                :src="ads.images[ads.primaryImage || 0]"
              >
                <v-card-title>{{ ads.title }}</v-card-title>
              </v-img>

              <v-card-subtitle class="pb-0">{{ ads.title }}</v-card-subtitle>

              <v-card-text class="text--primary">
                <div>{{ ads.summary }}</div>
              </v-card-text>

              <v-card-actions>
                <router-link
                  :to="{ name: 'adsEdit', params: { _id: ads._id } }"
                >
                  <v-btn color="orange" text>Edit</v-btn>
                </router-link>
                <v-btn color="red" @click="initiatedelete(ads._id)" text
                  >Delete</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </template>
      <template v-slot:footer>
        <v-row class="mt-2" align="center" justify="center">
          <v-spacer></v-spacer>

          <span class="mr-4 grey--text"
            >Page {{ skip + 1 }} of {{ totalPage }}</span
          >
          <v-btn
            fab
            dark
            color="blue darken-3"
            class="mr-1"
            @click="formerPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab dark color="blue darken-3" class="ml-1" @click="nextPage">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
    <v-dialog v-model="confirmModal" max-width="290">
      <v-card>
        <v-card-title class="headline">Delete?</v-card-title>

        <v-card-text>are you sure whant to delete?</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="confirmModal = false"
            >Cancel</v-btn
          >

          <v-btn color="red" text @click="confirmDelete">yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState, mapActions } from "vuex";

export default {
  name: "Ads",
  data: () => ({
    isModalOpen: false,
    confirmModal: false,
    selectedId: null,
    sortBy: "created_at:desc",
    limit: 6,
    skip: 0,
    selectedStatus: "all",
    statuses: [
      { name: "Semua", value: "all" },
      { name: "Active", value: "active" },
      { name: "Akan Datang", value: "incoming" },
      { name: "Telah lalu", value: "past" }
    ],
    sortOptions: [
      { title: "Title Asc", value: "title:asc" },
      { title: "Title Desc", value: "title:desc" },
      { title: "Created At Desc", value: "created_at:desc" },
      { title: "Created At Asc", value: "created_at:asc" },
      { title: "Mulai Dari Asc", value: "start_at:asc" },
      { title: "Mulai Dari Desc", value: "start_at:desc" },
      { title: "Berakhir Pada Desc", value: "end_at:desc" },
      { title: "Berakhir Pada Asc", value: "end_at:asc" }
    ],
    search: ""
  }),
  mounted() {
    this.refetchAds();
  },
  computed: {
    ...mapState({
      adses: state => state.ads.data,
      total: state => state.ads.total,
      loading: state => state.ads.loading
    }),
    totalPage: function() {
      return Math.ceil(this.total / this.limit);
    }
  },
  methods: {
    formerPage: function() {
      if (this.skip > 0) this.skip -= 1;
    },
    nextPage: function() {
      if (this.skip < this.totalPage) this.skip += 1;
    },
    initiatedelete: function(_id) {
      this.selectedId = _id;
      this.confirmModal = true;
    },

    confirmDelete: function() {
      this.deleteAds(this.selectedId).then(() => {
        this.selectedId = null;
        this.confirmModal = false;
        this.refetchAds();
      });
    },
    refetchAds: function() {
      this.getAdses({
        sort: this.sortBy,
        search: "name-regex:" + this.search,
        status: selected.status,
        limit: this.limit,
        skip: this.skip
      });
    },
    ...mapActions("ads", ["getAdses", "deleteAds"])
  },
  watch: {
    search: function() {
      this.refetchAds();
    },
    skip: function() {
      this.refetchAds();
    },
    sortBy: function() {
      this.refetchAds();
    }
  }
};
</script>
