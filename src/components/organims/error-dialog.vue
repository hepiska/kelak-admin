<template>
  <v-dialog v-model="isOpen" max-width="290">
    <v-card>
      <v-card-title class="headline">{{ title || "Error" }}</v-card-title>
      <v-card-text>
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="onChange">
          CloseModal
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Errordialog",
  props: {
    isOpen: Boolean,
    title: String,
    message: String
  },
  methods: {
    onChange() {
      this.$emit("change", this.isOpen);
    }
  }
};
</script>

<style>
</style>