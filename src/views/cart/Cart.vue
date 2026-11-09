<template>
  <v-container class="py-8">
    <div class="ani-head">
      <div class="ani-head-icon"><v-icon size="34">mdi-cart-outline</v-icon></div>
      <div>
        <h1 class="ani-head-title">ตะกร้าสินค้า</h1>
        <p class="ani-head-sub">ตรวจสอบสินค้าและจำนวนก่อนดำเนินการสั่งซื้อ</p>
      </div>
      <div class="ani-head-deco"><v-icon>mdi-cart-heart</v-icon></div>
    </div>

    <!-- ตะกร้าว่าง -->
    <v-card v-if="cart.length === 0" class="ani-card pa-10 text-center" flat>
      <div class="empty-icon mx-auto">
        <v-icon size="46">mdi-cart-outline</v-icon>
      </div>
      <h2 class="text-h6 mt-5 mb-2 font-weight-black">ยังไม่มีสินค้าในตะกร้า</h2>
      <p class="ani-muted mb-5">เลือกสินค้าที่คุณสนใจ แล้วกลับมาสั่งซื้อได้ที่นี่</p>
      <v-btn color="primary" large depressed to="/products" class="text-none px-8">
        <v-icon left>mdi-store-outline</v-icon>
        เลือกซื้อสินค้า
      </v-btn>
    </v-card>

    <v-row v-else align="start">
      <v-col cols="12" md="8">
        <v-card class="ani-card" flat>
          <div class="ani-card-head">
            <div class="ani-dot"><v-icon>mdi-package-variant-closed</v-icon></div>
            <span>รายการสินค้า</span>
            <v-spacer />
            <span class="ani-pill-chip">{{ cart.length }} รายการ</span>
          </div>

          <div class="px-5 py-2" style="border-bottom:1px solid var(--peach-soft)">
            <v-checkbox
              v-model="selectAll"
              label="เลือกสินค้าทั้งหมด"
              hide-details
              color="primary"
              class="mt-0 pt-0"
            />
          </div>

          <div v-for="item in cart" :key="item.id" class="ani-cart-item">
            <v-checkbox
              v-model="selectedIds"
              :value="String(item.id)"
              hide-details
              color="primary"
              class="ma-0 pa-0 flex-grow-0"
              :aria-label="`เลือก ${item.productname}`"
            />

            <div class="ani-cart-thumb">
              <v-img :src="getProductImage(item)" aspect-ratio="1" contain>
                <template slot="placeholder">
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular indeterminate size="22" color="primary" />
                  </div>
                </template>
              </v-img>
            </div>

            <div class="ani-cart-info">
              <div class="ani-cart-name">{{ item.productname }}</div>
              <div class="ani-muted mt-1">
                ราคา {{ Number(item.price).toLocaleString() }} บาท/ชิ้น
              </div>
              <div class="ani-stock">
                <v-icon x-small :color="Number(item.amount) > 0 ? 'success' : 'error'" class="mr-1">
                  {{ Number(item.amount) > 0 ? 'mdi-check-circle' : 'mdi-close-circle' }}
                </v-icon>
                <span :class="Number(item.amount) > 0 ? 'in' : 'out'">
                  {{ Number(item.amount) > 0 ? `คงเหลือ ${item.amount} ชิ้น` : 'สินค้าหมด' }}
                </span>
              </div>
              <v-btn text small color="error" class="text-none px-0 mt-1" @click="removeItem(item.id)">
                <v-icon left small>mdi-delete-outline</v-icon>
                ลบสินค้า
              </v-btn>
            </div>

            <div class="ani-cart-side">
              <div class="ani-qty">
                <v-btn icon small :disabled="item.quantity <= 1" @click="decreaseQuantity(item)">
                  <v-icon small>mdi-minus</v-icon>
                </v-btn>
                <span class="ani-qty-num">{{ item.quantity }}</span>
                <v-btn icon small :disabled="item.quantity >= item.amount" @click="increaseQuantity(item)">
                  <v-icon small>mdi-plus</v-icon>
                </v-btn>
              </div>

              <div class="ani-price ani-line-total">
                {{ (Number(item.price) * Number(item.quantity)).toLocaleString() }}
                <small>บาท</small>
              </div>
            </div>
          </div>
        </v-card>

        <v-card class="ani-more" flat to="/products">
          <v-icon color="primary" size="26" class="mr-3">mdi-lightbulb-outline</v-icon>
          <strong>ต้องการเพิ่มสินค้า?</strong>
          <span class="ani-muted ml-2">กลับไปเลือกซื้อสินค้าเพิ่มเติม</span>
          <v-spacer />
          <v-icon color="primary">mdi-arrow-right</v-icon>
        </v-card>
      </v-col>

      <!-- สรุปคำสั่งซื้อ -->
      <v-col cols="12" md="4">
        <v-card class="ani-card ani-summary" flat>
          <div class="ani-summary-head">
            <v-icon color="white" size="28" class="mr-3">mdi-text-box-check-outline</v-icon>
            สรุปคำสั่งซื้อ
          </div>

          <v-card-text class="pa-5">
            <div class="ani-sum-row">
              <div class="ani-dot"><v-icon small>mdi-cart-check</v-icon></div>
              <span class="label">จำนวนสินค้าที่เลือก</span>
              <span class="value">{{ selectedQuantity }} ชิ้น</span>
            </div>

            <div class="ani-sum-row mt-4">
              <div class="ani-dot"><v-icon small>mdi-truck-outline</v-icon></div>
              <span class="label">ค่าจัดส่ง</span>
              <span class="value ani-muted">คำนวณตอนสั่งซื้อ</span>
            </div>

            <div class="ani-total-badge mt-6">
              <span>ยอดรวมสินค้า</span>
              <span class="amount">
                {{ Number(selectedTotal).toLocaleString() }}
                <small style="font-size:14px;font-style:normal">บาท</small>
              </span>
            </div>

            <v-alert v-if="checkoutError" type="error" dense text class="mt-5 mb-0">
              {{ checkoutError }}
            </v-alert>

            <v-btn
              block
              large
              depressed
              color="primary"
              class="ani-checkout mt-5 text-none"
              :loading="checkingOut"
              :disabled="selectedItems.length === 0 || checkingOut"
              @click="checkout"
            >
              <v-icon left>mdi-cart-arrow-right</v-icon>
              สั่งซื้อ
            </v-btn>

            <div class="d-flex align-center justify-center mt-4 ani-muted" style="font-size:13px">
              <v-icon small color="primary" class="mr-1">mdi-shield-check-outline</v-icon>
              กรุณาตรวจสอบจำนวนสินค้าก่อนสั่งซื้อ
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<!-- <style src="../../assets/css/cart.css"></style> -->

<script>
import useCart from "@/hooks/useCart";

export default {
  name: "Cart",

  mixins: [useCart],

};
</script>
<style src="../../assets/css/theme-pages.css"></style>
<style src="../../assets/css/theme.css"></style>
