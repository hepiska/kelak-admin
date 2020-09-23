<template>
  <div>
    <v-app-bar app dense dark color="primary" height="64">
      <v-toolbar-title class="headline">Users</v-toolbar-title>
    </v-app-bar>

    <h1>sas</h1>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from "vuex";

export default {
  name: "User",
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
    search: ""
  })
};
</script>
