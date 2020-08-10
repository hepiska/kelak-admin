<template>
  <v-navigation-drawer color="primary" dark app>
    <v-list dense nav>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline">Kelak</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="my-3"></v-divider>
      <v-list-item v-for="item in items" :key="item.title" link :to="item.link">
        <v-list-item-icon>
          <v-icon color="white">{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <v-list-item>
        <v-list-item-avatar>
          <img src="https://randomuser.me/api/portraits/men/81.jpg" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>User</v-list-item-title>
          <v-list-item-subtitle>Roles</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "Sidebar",
  data: () => ({
    items: [
      { title: "Articles", icon: "mdi-book", link: "/articles" },
      { title: "User", icon: "mdi-face", link: "/users" },
      { title: "Ads", icon: "mdi-help-box", link: "/ads" }
    ]
  })
};
</script>
