<template>
  <v-container fluid>
    <v-app-bar app dense dark color="primary" height="64">
      <v-toolbar-title class="headline">Article</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="changeModal">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-app-bar>
    <v-data-iterator :items="articles" hide-default-footer>
      <template v-slot:header>
        <v-toolbar class="mb-2" color="primary" dark flat>
          <v-toolbar-title>This is a header</v-toolbar-title>
        </v-toolbar>
      </template>
    </v-data-iterator>
    <ArticleCreateModal
      :isOpen="isModalOpen"
      @changemodal="changeModal"
    ></ArticleCreateModal>
  </v-container>
</template>

<script>
// @ is an alias to /src
import { mapState } from "vuex";
import ArticleCreateModal from "../../components/organims/articleCreateModal.vue";

export default {
  name: "Article",
  data: () => ({
    articles: [],
    isModalOpen: false,
  }),
  mounted() {
    this.isModalOpen = this.$route.query.isModalOpen;
  },
  components: {
    ArticleCreateModal,
  },
  methods: {
    changeModal: function() {
      this.isModalOpen = !this.isModalOpen;
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, isModalOpen: this.isModalOpen },
      });
    },
  },
};
</script>
