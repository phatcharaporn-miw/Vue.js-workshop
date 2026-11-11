<template>
  <v-container class="py-8 px-4 px-md-8">
    <div class="ani-head">
      <div>
        <h1 class="ani-head-title">คำสั่งซื้อทั้งหมด</h1>
        <p class="ani-head-sub">ตรวจสอบคำสั่งซื้อจากลูกค้าทั้งหมด</p>
      </div>
      <v-spacer />
      <span v-if="orders.length" class="ani-pill-chip mb-2">{{ orders.length }} คำสั่งซื้อ</span>
    </div>

    <v-alert v-if="error" type="error" text border="left">{{ error }}</v-alert>

    <div v-else-if="loading && orders.length === 0" class="text-center py-10">
      <v-progress-circular indeterminate color="primary" size="45" />
      <p class="ani-muted mt-3">กำลังโหลดคำสั่งซื้อ...</p>
    </div>

    <v-card v-else-if="orders.length === 0" flat class="ani-card pa-10 text-center">
      <div class="empty-icon mx-auto"><v-icon size="40">mdi-clipboard-text-outline</v-icon></div>
      <h2 class="text-h6 mt-5 font-weight-bold">ยังไม่มีคำสั่งซื้อ</h2>
    </v-card>

    <div v-else>
      <v-card
        v-for="(order, orderIndex) in paginatedOrders"
        :key="order._id || order.id || order.ponumber || orderIndex"
        flat
        class="ani-card mb-5"
      >
        <div class="ani-order-head">
          <div class="ani-dot"><v-icon>mdi-receipt-text-outline</v-icon></div>
          <div class="flex-grow-1">
            <div class="font-weight-bold">วันที่สั่ง {{ formatDate(order.createdAt) }}</div>
          </div>
          <span v-if="order.status" class="ani-pill-chip">{{ order.status }}</span>
        </div>

        <div class="ani-buyer">
          <v-icon small>mdi-account-outline</v-icon>
          <span class="ani-muted">ผู้สั่งซื้อ</span>
          <span class="ani-buyer-name">
            {{ (order.buyer && order.buyer.name) || '-' }}
            {{ (order.buyer && order.buyer.lastname) || '' }}
          </span>
        </div>

        <!-- รายการสินค้า -->
        <div
          v-for="(item, itemIndex) in order.items || []"
          :key="item._id || item.productCode || itemIndex"
          class="ani-order-item"
        >
          <div class="ani-cart-thumb">
            <v-img :src="getProductImage(item)" aspect-ratio="1" contain />
          </div>

          <div class="ani-cart-info">
            <div class="ani-cart-name">{{ item.productname || 'สินค้า' }}</div>
            <div class="ani-muted mt-1">
              จำนวน {{ Number(item.quantity || 0) }} ชิ้น
              <span v-if="item.price !== undefined">· {{ formatPrice(item.price) }} / ชิ้น</span>
            </div>
          </div>
        </div>

        <div v-if="!order.items || order.items.length === 0" class="text-center ani-muted py-4">
          ไม่พบรายละเอียดสินค้าในคำสั่งซื้อนี้
        </div>

        <!-- ยอดรวม -->
        <div class="ani-order-total">
          <span class="ani-muted">ยอดรวม</span>
          <span class="ani-price" style="font-size:1.4rem">
            {{ formatPrice(order.totalAmount !== undefined ? order.totalAmount : order.total) }}
          </span>
        </div>
      </v-card>

      <v-pagination
        v-if="pageCount > 1"
        v-model="currentPage"
        :length="pageCount"
        :total-visible="5"
        class="ani-pager"
        color="primary"
      />
    </div>
  </v-container>
</template>

<script>
import useManageOrder from '@/hooks/useManageOrder';

export default {
  name: 'ManageOrder',

  mixins: [useManageOrder],

  data() {
    return {
      currentPage: 1,
      itemsPerPage: 4,
    }
  },

  computed: {
    pageCount() {
      return Math.ceil(this.orders.length / this.itemsPerPage)
    },

    paginatedOrders() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      return this.orders.slice(start, start + this.itemsPerPage)
    },
  },
}
</script>

<style src="../../assets/css/theme.css"></style>
