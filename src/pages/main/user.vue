<template>
  <div>
    <v-app-bar
      app
      dense
      dark
      color="primary"
      height="64"
    >
      <v-toolbar-title class="headline">
        Users
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        icon
        @click="openCreate"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-app-bar>
    <v-data-iterator
      :items="users"
      hide-default-footer
      :loading="loading"
    >
      <template v-slot:header>
        <v-toolbar
          class="mb-2"
          color="primary"
          dark
          flat
        >
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            label="Search"
          />
          <v-spacer />
          <v-select
            v-model="sortBy"
            flat
            solo-inverted
            hide-details
            :items="sortOptions"
            label="Sort by"
            item-text="title"
          />
        </v-toolbar>
      </template>
      <template>
        <v-row>
          <v-col
            v-for="user in users"
            :key="user._id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              class="mx-auto"
              max-width="400"
            >
              <v-card-subtitle class="pb-0">
                {{ user.name }}
              </v-card-subtitle>
              <v-card-text class="text--primary">
                <div>{{ user.email }}</div>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="orange"
                  text
                  @click="openEdit(user._id)"
                >
                  Edit
                </v-btn>

                <v-btn
                  color="red"
                  text
                  @click="initiateDelete(user._id)"
                >
                  Delete
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </template>
      <template v-slot:footer>
        <v-row
          class="mt-2"
          align="center"
          justify="center"
        >
          <v-spacer />

          <span class="mr-4 grey--text">Page {{ skip + 1 }} of {{ totalPage }}</span>
          <v-btn
            fab
            dark
            color="blue darken-3"
            class="mr-1"
            @click="prevPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            fab
            dark
            color="blue darken-3"
            class="mr-1"
            @click="nextPage"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
    <UserCreateModal
      v-if="isModalOpen"
      :is-open="isModalOpen"
      :_id="selectedId"
      @changeModal="changeModal"
    />
    <v-dialog
      v-model="confirmModal"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">
          Delete?
        </v-card-title>
        <v-card-text>Are you sure want to delete?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            text
            @click="confirmModal = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="red"
            text
            @click="confirmDelete"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState, mapActions } from "vuex";
import UserCreateModal from "../../components/organims/userCreateModal.vue";

export default {
  name: "User",
  components: {
    UserCreateModal,
  },
  data: () => ({
    isModalOpen: false,
    confirmModal:false,
    sortBy: "created_at:desc",
    limit: 6,
    skip: 0,
    search: "",
    selectedId: null,
    sortOptions: [
      { title: "Title Asc", value: "title:asc" },
      { title: "Title Desc", value: "title:desc" },
      { title: "Created At Asc", value: "created_at:asc" },
      { title: "Created At Desc", value: "created_at:desc" },
    ],
  }),
  computed: {
    ...mapState({
      users: state=> state.users.data,
      total: state=> state.users.total,
      loading: state=> state.users.loading,
    }),
    totalPage: function() {
      return Math.ceil(this.total / this.limit)
    }
  },
  watch: {
    skip: function() {
      this.refetchUser()
    },
    search: function() {
      this.refetchUser()
    },
    sortBy: function() {
      this.refetchUser()
    },
  },
  mounted() {
    // this.isModalOpen = this.$route.query.isModalOpen;
    this.refetchUser();
  },
  methods: {
    changeModal: function() {
      this.isModalOpen = !this.isModalOpen
    },
    refetchUser: function() {
      this.getUsers({
        sort: this.sortBy,
        search: "name-regex:" + this.search,
        limit: this.limit,
        skip: this.skip,
      })
    },
    openCreate: function () {
      this.selectedId = null
      this.isModalOpen = true
    },
    openEdit: function(id) {
      this.selectedId=id;
      this.isModalOpen=true;
    },
    initiateDelete: function(id) {
      this.selectedId=id;
      this.confirmModal=true;
    },
    confirmDelete: function() {
      this.deleteUsers(this.selectedId)
      this.confirmModal=false;
    },
    nextPage: function() {
      if (this.skip < this.totalPage - 1) {
        this.skip += 1
      }
    },
    prevPage: function() {
      if (this.skip >0) {
        this.skip -= 1
      }
    },
    ...mapActions("users", ["getUsers", "deleteUsers"])
  }
};
</script>
