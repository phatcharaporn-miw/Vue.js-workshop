<template>
  <div>
    <v-app-bar app color="black" dark elevation="0" height="76" class="store-navbar">
      <v-btn text to="/products" class="brand-button text-none px-2">
        <div class="brand-logo mr-3">
          <v-icon color="white" size="30">mdi-storefront</v-icon>
        </div>
        <div class="brand-text">
          <div class="brand-name">Comic verse</div>
        </div>
      </v-btn>

      <v-spacer />

      <v-btn text to="/products" class="nav-button text-none mx-1" active-class="nav-active">
        <v-icon left small>mdi-view-grid-outline</v-icon>
        สินค้า
      </v-btn>

      <v-btn
        text
        :to="{ name: 'cart' }"
        class="nav-button cart-button text-none mx-1"
        aria-label="ตะกร้าสินค้า"
        active-class="nav-active"
      >
        <v-badge :content="cartCount" :value="cartCount > 0" color="primary" overlap bordered>
          <v-icon>mdi-cart-outline</v-icon>
        </v-badge>
        <span class="ml-2 hidden-sm-and-down">ตะกร้าสินค้า</span>
      </v-btn>

      <v-btn
        v-if="isLoggedIn && !isAdmin"
        text
        to="/my-orders"
        class="nav-button text-none mx-1"
        active-class="nav-active"
      >
        <v-icon left small>mdi-clipboard-list-outline</v-icon>
        <span class="hidden-sm-and-down">รายการสั่งซื้อ</span>
      </v-btn>

      <v-btn v-if="!isLoggedIn" depressed to="/login" class="login-button text-none ml-3">
        <v-icon left>mdi-login</v-icon>
        เข้าสู่ระบบ
      </v-btn>

      <v-menu v-else offset-y left rounded="xl" min-width="220" content-class="profile-menu">
        <template slot="activator" slot-scope="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" text class="profile-button text-none ml-2" aria-label="เมนูโปรไฟล์">
            <v-avatar size="36" class="profile-avatar mr-2">
              <v-icon color="white" size="24">mdi-account</v-icon>
            </v-avatar>
            <span class="hidden-sm-and-down profile-label">บัญชีของฉัน</span>
            <v-icon small class="ml-1">mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list dense class="profile-list py-2">
          <!-- <v-subheader class="profile-heading">บัญชีผู้ใช้</v-subheader> -->

          <v-list-item to="/profile" link>
            <v-list-item-icon>
              <v-icon color="primary">mdi-account-circle-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>โปรไฟล์ของฉัน</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider class="my-2" />

          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon color="error">mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="red--text">ออกจากระบบ</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main class="store-main">
      <router-view />
    </v-main>

    <app-footer :logged-in="isLoggedIn" />
  </div>
</template>

<script>
import { getToken, Logout } from "@/services/auth";

export default {
  data() {
    return {
      isLoggedIn: false,
      isAdmin: false,
      cartCount: 0,
    };
  },

  created() {
    this.refreshLogin();
    this.refreshCart();

    window.addEventListener("cart-updated", this.refreshCart);
    window.addEventListener("storage", this.refreshCart);
  },

  beforeDestroy() {
    window.removeEventListener("cart-updated", this.refreshCart);
    window.removeEventListener("storage", this.refreshCart);
  },

  watch: {
    $route() {
      this.refreshLogin();
      this.refreshCart();
    },
  },

  methods: {
    refreshLogin() {
      this.isLoggedIn = !!getToken();
      this.isAdmin = this.isLoggedIn && localStorage.getItem("role") === "0";
    },

    refreshCart() {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");

        this.cartCount = Array.isArray(cart)
          ? cart.reduce((total, item) => {
              return total + Number(item.quantity || 0);
            }, 0)
          : 0;
      } catch (error) {
        this.cartCount = 0;
      }
    },

    logout() {
      Logout();
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.$router.replace("/login");
    },
  },
};
</script>

<style src="../assets/css/theme-pages.css"></style>
<style src="../assets/css/theme.css"></style>
