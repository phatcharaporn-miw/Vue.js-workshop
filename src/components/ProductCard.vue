<template>
  <v-card class="ani-product" flat tile>
    <div class="ani-product-media">
      <span v-if="Number(product.amount) <= 0" class="ani-pill-chip ani-product-badge">สินค้าหมด</span>
      <span v-else-if="Number(product.amount) <= 5" class="ani-pill-chip ani-product-badge">เหลือน้อย</span>

      <v-img
        :src="`http://localhost:3000/${String(product.image || '').replace(/^\/+/, '')}`"
        aspect-ratio="0.8"
        contain
      >
        <template slot="placeholder">
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular indeterminate color="primary" size="26" />
          </div>
        </template>
      </v-img>
    </div>

    <v-card-text class="ani-product-body">
      <div class="d-flex align-start justify-space-between">
        <div class="ani-product-name" :title="product.productname">{{ product.productname }}</div>
        <div class="ani-price ani-product-price ml-3">{{ formatPrice(product.price) }}</div>
      </div>

      <div class="ani-stock">
        <v-icon x-small :color="Number(product.amount) > 0 ? 'success' : 'error'" class="mr-1">
          {{ Number(product.amount) > 0 ? 'mdi-check-circle' : 'mdi-close-circle' }}
        </v-icon>
        <span :class="Number(product.amount) > 0 ? 'in' : 'out'">
          {{ Number(product.amount) > 0 ? `มีสินค้า ${product.amount} ชิ้น` : 'สินค้าหมดชั่วคราว' }}
        </span>
      </div>
    </v-card-text>

    <v-card-actions class="ani-product-actions">
      <v-btn
        outlined
        class="btn-pill-outline text-none ani-product-action-btn"
        :disabled="!productId"
        :to="{ name: 'productdetail', params: { id: String(productId) } }"
      >
        <span>รายละเอียด</span>
      </v-btn>
      <v-spacer />

      <v-btn
        depressed
        color="primary"
        class="text-none ani-product-action-btn"
        :disabled="Number(product.amount) <= 0"
        @click="handleAddToCart"
      >
        <v-icon left small>{{ isLoggedIn ? 'mdi-cart-plus' : 'mdi-login' }}</v-icon>
        {{ isLoggedIn ? 'ใส่ตะกร้า' : 'เข้าสู่ระบบเพื่อซื้อ' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { isAuthenticated } from '@/services/auth'

export default {
  name: 'ProductCard',

  props: {
    product: {
      type: Object,
      required: true,
    },
  },

  computed: {
    isLoggedIn() {
      return Boolean(this.$route.fullPath && isAuthenticated())
    },

    productId() {
      return this.product._id || this.product.id
    },
  },

  methods: {
    formatPrice(price) {
      return Number(price || 0).toLocaleString('th-TH', {
        style: 'currency',
        currency: 'THB',
        maximumFractionDigits: 2,
      })
    },

    handleAddToCart() {
      if (!this.isLoggedIn) {
        this.$router.push('/login')
        return
      }
      this.$emit('add-to-cart', this.product)
    }
  },
}
</script>

<style src="../assets/css/theme.css"></style>
<style src="../assets/css/theme-pages.css"></style>
<!-- <style src="../assets/css/productcard.css"></style> -->
