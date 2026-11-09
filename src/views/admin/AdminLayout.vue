<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      app
      class="ani-drawer"
      color="black"
      dark
      :permanent="$vuetify.breakpoint.mdAndUp"
      :temporary="!$vuetify.breakpoint.mdAndUp"
    >
      <div class="ani-drawer-head">
        <div class="ani-drawer-logo">
          <v-icon dark>mdi-shield-account</v-icon>
        </div>
        <div>
          <div class="ani-drawer-title">จัดการร้านค้า</div>
          <div class="ani-drawer-sub">ผู้ดูแลระบบ</div>
        </div>
      </div>

      <v-list nav dense class="pa-0 mt-3">
        <v-list-item to="/admin/products" link>
          <v-list-item-icon
            ><v-icon>mdi-package-variant</v-icon></v-list-item-icon
          >
          <v-list-item-title>จัดการสินค้า</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/orders" link>
          <v-list-item-icon
            ><v-icon>mdi-receipt-text-outline</v-icon></v-list-item-icon
          >
          <v-list-item-title>คำสั่งซื้อทั้งหมด</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/users" link>
          <v-list-item-icon
            ><v-icon>mdi-account-multiple-outline</v-icon></v-list-item-icon
          >
          <v-list-item-title>จัดการผู้ใช้</v-list-item-title>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-divider />
        <v-list nav dense class="pa-0">
          <v-list-item @click="logout">
            <v-list-item-icon
              ><v-icon color="error">mdi-logout</v-icon></v-list-item-icon
            >
            <v-list-item-title class="red--text">ออกจากระบบ</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-main class="store-main admin-main">
      <router-view />
    </v-main>
  </div>
</template>

<script>
import { Logout } from "@/services/auth";

export default {
  name: "AdminLayout",

  data() {
    return {
      drawer: false,
    };
  },

  computed: {
    pageTitle() {
      return this.$route.path === "/admin/orders"
        ? "คำสั่งซื้อทั้งหมด"
        : this.$route.path === "/admin/users"
        ? "จัดการผู้ใช้"
        : "จัดการสินค้า";
    },
  },

  methods: {
    logout() {
      Logout();
      this.$router.replace("/login");
    },
  },
};
</script>

<style src="../../assets/css/theme-pages.css"></style>
<style src="../../assets/css/theme.css"></style>
