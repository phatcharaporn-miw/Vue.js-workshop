<template>
  <v-container class="py-8">
    <div class="ani-head">
      <div class="ani-head-icon"><v-icon size="34">mdi-clipboard-list-outline</v-icon></div>
      <div>
        <h1 class="ani-head-title">รายการสั่งซื้อของฉัน</h1>
        <p class="ani-head-sub">ตรวจสอบรายการคำสั่งซื้อของคุณ</p>
      </div>
    </div>

    <v-alert v-if="error" type="error" text rounded="xl">{{ error }}</v-alert>

    <div v-else-if="loading" class="text-center py-10">
      <v-progress-circular indeterminate color="primary" size="45" />
      <p class="ani-muted mt-3">กำลังโหลดรายการสั่งซื้อ...</p>
    </div>

    <v-card v-else-if="orders.length === 0" class="ani-card pa-10 text-center" flat>
      <div class="empty-icon mx-auto">
        <v-icon size="46">mdi-clipboard-text-outline</v-icon>
      </div>
      <h2 class="text-h6 mt-5 font-weight-black">ยังไม่มีรายการสั่งซื้อ</h2>
      <p class="ani-muted mt-2">สินค้าที่คุณสั่งซื้อจะแสดงที่หน้านี้</p>
      <v-btn color="primary" depressed large to="/products" class="mt-4 text-none px-8">
        <v-icon left>mdi-store</v-icon>
        เลือกซื้อสินค้า
      </v-btn>
    </v-card>

    <div v-else>
      <div class="d-flex align-center justify-space-between mb-4">
        <h2 class="section-title">ประวัติการสั่งซื้อ</h2>
        <span class="ani-pill-chip">{{ orders.length }} รายการ</span>
      </div>

      <v-card
        v-for="(order, orderIndex) in paginatedOrders"
        :key="order._id || order.ponumber || orderIndex"
        class="ani-card mb-5"
        flat
      >
        <div class="ani-order-head">
          <div class="ani-dot"><v-icon>mdi-receipt-text-outline</v-icon></div>
          <div>
            <div class="font-weight-black">คำสั่งซื้อรายการที่ {{ orderIndex + 1 }}</div>
            <div class="text-caption" style="opacity:.9">{{ formatDate(order.createdAt) }}</div>
          </div>
        </div>

        <div v-for="(item, itemIndex) in order.items || []" :key="item.productCode || itemIndex" class="ani-order-item">
          <div class="ani-cart-thumb">
            <v-img :src="getProductImage(item)" aspect-ratio="1" contain />
          </div>

          <div class="ani-cart-info">
            <div class="ani-cart-name">{{ item.productname || 'สินค้า' }}</div>
            <div class="ani-muted mt-1">จำนวน {{ item.quantity }} ชิ้น</div>
            <div class="ani-muted" style="font-size:12px">{{ formatPrice(item.price) }} / ชิ้น</div>
          </div>
        </div>

        <div v-if="!order.items || order.items.length === 0" class="text-center ani-muted py-4">
          ไม่พบรายการสินค้าในคำสั่งซื้อนี้
        </div>

        <div class="ani-order-total">
          <span class="ani-muted">ยอดรวมทั้งสิ้น</span>
          <span class="ani-price" style="font-size:1.4rem">{{ formatPrice(order.totalAmount) }}</span>
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
import orderService from '@/services/orderservice'

export default {
  name: 'MyOrders',

  data() {
    return {
      orders: [],
      loading: false,
      error: '',
      currentPage: 1,
      itemsPerPage: 4 ,
    }
  },

  created() {
    this.fetchOrders()
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

  methods: {
    async fetchOrders() {
      this.loading = true
      this.error = ''

      try {
        const { data } = await orderService.getAll()

        const result = Array.isArray(data)
          ? data
          : data && Array.isArray(data.data)
          ? data.data
          : data && Array.isArray(data.orders)
          ? data.orders
          : null

        if (!result) {
          throw new Error('รูปแบบข้อมูลรายการสั่งซื้อไม่ถูกต้อง')
        }

        this.orders = result
      } catch (error) {
        console.error(
          'Fetch orders error:',
          error.response?.data || error
        )
        this.error =
          error.response?.data?.message ||
          'ไม่สามารถโหลดรายการสั่งซื้อได้'
      } finally {
        this.loading = false
      }
    },

    getProductImage(item) {
      const image = item.image

      if (!image) {
        return 'https://placehold.co/300x300?text=Product'
      }

      if (image.startsWith('http')) {
        return image
      }

      return `http://localhost:3000${
        image.startsWith('/') ? '' : '/'
      }${image}`
    },

    formatPrice(value) {
      return Number(value || 0).toLocaleString('th-TH', {
        style: 'currency',
        currency: 'THB',
        maximumFractionDigits: 2,
      })
    },

    formatDate(value) {
      if (!value) {
        return 'ไม่ระบุวันที่'
      }

      const date = new Date(value)

      if (Number.isNaN(date.getTime())) {
        return 'ไม่ระบุวันที่'
      }

      return date.toLocaleString('th-TH')
    },
  },
}
</script>

<style src="../assets/css/theme-pages.css"></style>
<style src="../assets/css/theme.css"></style>
