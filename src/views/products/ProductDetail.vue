<!-- <template>
  <div class="detail-page">
    <v-container class="py-8">

      <v-progress-linear v-if="loading" indeterminate color="primary" rounded />

      <v-alert v-else-if="error" type="error" rounded="xl">{{ error }}</v-alert>

      <v-row v-else-if="product" align="center">
        <v-col cols="12" md="5">
          <div class="detail-image-wrap pa-4">
            <v-img
              :src="`http://localhost:3000/${product.image}`"
              height="320"
              contain
            />
          </div>
        </v-col>

        <v-col cols="12" md="7">
          <v-card class="glass-card pa-6" flat>
            <div class="d-flex align-start justify-space-between">
              <h1 class="text-h5 font-weight-black">{{ product.productname }}</h1>
              <span class="price-badge ml-4">{{ formatPrice(product.price) }}</span>
            </div>

            <p class="mt-4 mb-3">{{ product.productdetail }}</p>

            <div class="detail-status mb-5">
              คงเหลือ: {{ product.amount }} ชิ้น
            </div>

            <v-btn
              color="primary"
              large
              depressed
              class="text-none px-8"
              :disabled="Number(product.amount) <= 0"
              @click="handleAddToCart"
            >
              <v-icon left>mdi-cart-plus</v-icon>
              {{ isLoggedIn ? 'เพิ่มลงตะกร้า' : 'เข้าสู่ระบบเพื่อซื้อ' }}
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template> -->

<template>
  <div class="detail-page">
    <v-container class="py-6 py-md-10 max-content-container">

      <v-progress-linear v-if="loading" indeterminate color="primary" rounded height="6" />

      <v-alert v-else-if="error" type="error" variant="tonal" class="rounded-xl">{{ error }}</v-alert>

      <v-card v-else-if="product" class="glass-card overflow-hidden pa-4 pa-md-8" elevation="3" rounded="xl">
        <v-row align="center" justify="center">
          <v-col cols="12" md="6">
            <div class="detail-image-wrap rounded-lg d-flex align-center justify-center pa-4">
              <v-img
                :src="`http://localhost:3000/${product.image}`"
                height="380"
                max-height="420"
                contain
                alt="Product Image"
              />
            </div>
          </v-col>

          <v-col cols="12" md="6" class="d-flex flex-column justify-center pl-md-6">
            <h1 class="text-h4 font-weight-bold mb-2 text-primary-dark">
              {{ product.productname }}
            </h1>

            <div class="price-section my-3">
              <span class="text-h4 font-weight-black color-price">
                {{ formatPrice(product.price) }}
              </span>
            </div>

            <v-divider class="my-4" />

            <div class="description-section mb-6">
              <div class="text-subtitle-2 font-weight-bold text-grey-darken-1 mb-1">
                รายละเอียดสินค้า
              </div>
              <p class="text-body-1 text-medium-emphasis leading-relaxed">
                {{ product.productdetail }}
              </p>
            </div>

            <div class="detail-status mb-5">
              คงเหลือ: {{ product.amount }} ชิ้น
            </div>

            <div class="action-section">
              <v-btn
                color="primary"
                size="x-large"
                block
                rounded="lg"
                elevation="2"
                class="text-none text-subtitle-1 font-weight-bold"
                :disabled="Number(product.amount) <= 0"
                @click="handleAddToCart"
              >
                <v-icon left size="24" class="mr-2">mdi-cart-plus</v-icon>
                {{ isLoggedIn ? 'เพิ่มลงตะกร้าสินค้า' : 'เข้าสู่ระบบเพื่อสั่งซื้อ' }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>

    </v-container>
  </div>
</template>

<script>
import productService from "@/services/productService";
import { isAuthenticated } from "@/services/auth";

export default {
  name: "ProductDetail",
  data() {
    return {
      product: null,
      loading: false,
      error: "",
    };
  },
  computed: {
    isLoggedIn() {
      return Boolean(this.$route.fullPath && isAuthenticated());
    },
  },
  created() {
    this.fetchProducts();
  },
  watch: {
    "$route.params.id"() {
      this.fetchProducts();
    },
  },
  methods: {
    async fetchProducts() {
      const id = this.$route.params.id;

      if (!id || id === "undefined") {
        this.product = null;
        this.error = "ไม่พบรหัสสินค้า";
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        const response = await productService.getById(id);
        const result = response.data;
        this.product = result && result.data ? result.data : result;

      } catch (error) {
        this.product = null;
        this.error = "ไม่สามารถโหลดรายละเอียดสินค้าได้";
      } finally {
        this.loading = false;
      }
    },
    formatPrice(price) {
      return Number(price || 0).toLocaleString("th-TH", {
        style: "currency",
        currency: "THB",
        maximumFractionDigits: 2,
      });
    },

    handleAddToCart() {
      if (!this.isLoggedIn) {
        this.$toast("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า", "error");
        this.$router.push("/login");
        return;
      }
      this.$emit("add-to-cart", this.product);
    },
  },
};
</script>

<style src="../../assets/css/theme.css"></style>
<style src="../../assets/css/theme-pages.css"></style>
