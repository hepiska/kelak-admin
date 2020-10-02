<template>
  <div>
    <v-app-bar app dense dark color="primary" height="64">
      <v-toolbar-title class="headline">Users</v-toolbar-title>
    </v-app-bar>

    <v-data-table
      :items="users"
      hide-default-footer
      :loading="loading"
      :headers="headers"
    >
      <template v-slot:top>
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
          <v-spacer></v-spacer>
          <router-link :to="{ name: 'userCreate' }">
            <v-btn icon>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </router-link>
        </v-toolbar>
      </template>
      <template v-slot:item.roles="{ item }">
        {{ item.roles.join(", ") }}
      </template>
      <template v-slot:item.actions="{ item }">
        <router-link :to="{ name: 'userEdit', params: { _id: item._id } }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
        </router-link>
        <v-icon small @click="initiatedelete(item)">
          mdi-delete
        </v-icon>
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
    </v-data-table>
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
  name: "User",
  data: () => ({
    isModalOpen: false,
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name"
      },
      { text: "Email", value: "email", sortable: false },
      { text: "Roles", value: "roles", sortable: false },
      { text: "Actions", value: "actions", sortable: false }
    ],
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
    search: ""
  }),
  methods: {
    formerPage: function() {
      if (this.skip > 0) this.skip -= 1;
    },
    nextPage: function() {
      if (this.skip < this.totalPage) this.skip += 1;
    },
    goToEdit: function({ _id }) {},
    initiatedelete: function({ _id }) {
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
    refetchUsers: function() {
      this.getUsers({
        sort: this.sortBy,
        search: "name-regex:" + this.search,
        status: this.selectedStatus,
        limit: this.limit,
        skip: this.skip
      }).then(() => {});
    },
    ...mapActions("users", ["getUsers", "deleteUsers"])
  },
  mounted() {
    this.refetchUsers();
  },
  computed: {
    ...mapState({
      users: state => state.users.data,
      total: state => state.users.total,
      loading: state => state.users.loading
    })
  }
};
</script>
