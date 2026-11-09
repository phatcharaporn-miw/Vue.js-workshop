<template>
  <footer class="ani-footer">
    <div class="ani-footer-inner">
      <div class="ani-footer-top">
        <div>
          <p class="ani-footer-brand">Comic verse</p>
          <p class="ani-footer-tag">
            สินค้าคุณภาพที่คัดมาเพื่อคุณ เลือกชม ใส่ตะกร้า และสั่งซื้อได้ง่าย ๆ ในไม่กี่ขั้นตอน
          </p>
        </div>

        <div>
          <h4>เมนู</h4>
          <ul>
            <li><router-link to="/products">สินค้า</router-link></li>
            <li><router-link :to="{ name: 'cart' }">ตะกร้าสินค้า</router-link></li>
            <li v-if="loggedIn"><router-link to="/my-orders">รายการสั่งซื้อ</router-link></li>
          </ul>
        </div>

        <div>
          <h4>บัญชี</h4>
          <ul>
            <li v-if="loggedIn"><router-link to="/profile">โปรไฟล์ของฉัน</router-link></li>
            <li v-else><router-link to="/login">เข้าสู่ระบบ</router-link></li>
          </ul>
        </div>

        <div>
          <h4>ติดต่อเรา</h4>
          <ul class="ani-footer-contact">
            <li><v-icon small>mdi-email-outline</v-icon>comic@example.com</li>
            <li><v-icon small>mdi-phone-outline</v-icon>02-000-0000</li>
            <li><v-icon small>mdi-clock-outline</v-icon>ทุกวัน 09:00 – 18:00</li>
          </ul>
        </div>
      </div>

      <div class="ani-footer-bottom">
        <span>© {{ year }} ร้านค้า สงวนลิขสิทธิ์</span>
        <button type="button" class="ani-totop" @click="$vuetify.goTo(0)">
          <v-icon small color="white">mdi-arrow-up</v-icon>
          กลับขึ้นด้านบน
        </button>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  props: {
    loggedIn: { type: Boolean, default: false },
  },
  data() {
    return { year: new Date().getFullYear() }
  },
}
</script>