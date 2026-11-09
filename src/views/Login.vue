<template>
  <v-container fluid class="ani-login">
    <v-row align="center" justify="center" style="min-height:100vh">
      <v-col cols="12" md="5" lg="4" class="ani-login-brand">
        <div class="logo"><v-icon color="white" size="38">mdi-storefront</v-icon></div>
        <h1>ยินดีต้อนรับ<br /><em>Comic verse</em></h1>
        <p>เข้าสู่ระบบเพื่อดูตะกร้าและติดตามรายการสั่งซื้อของคุณ</p>
      </v-col>

      <v-col cols="12" sm="8" md="5" lg="4" xl="3">
        <v-card class="ani-login-card" flat>
          <div class="text-center mb-6">
            <h2 class="text-h5 font-weight-black">เข้าสู่ระบบ</h2>
            <p class="ani-muted mb-0">กรุณากรอกข้อมูลเพื่อเข้าใช้งาน</p>
          </div>

          <v-form @submit.prevent="login">
            <v-text-field
              v-model="username"
              label="Username"
              prepend-inner-icon="mdi-account-outline"
              outlined
              rounded
              required
              autofocus
              class="ani-field"
            />

            <v-text-field
              v-model="password"
              label="Password"
              prepend-inner-icon="mdi-lock-outline"
              :append-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              :type="showPassword ? 'text' : 'password'"
              outlined
              rounded
              required
              class="ani-field"
              @click:append="showPassword = !showPassword"
            />

            <v-alert v-if="error" type="error" dense text border="left" class="mb-4">
              {{ error }}
            </v-alert>

            <v-btn
              type="submit"
              color="primary"
              block
              large
              depressed
              class="ani-checkout mt-2 text-none"
              :loading="loading"
            >
              เข้าสู่ระบบ
            </v-btn>
          </v-form>
          <span>สมัครบัญชี</span>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import loginService from '@/services/loginService'
import { saveUserProfile } from '@/services/auth'

export default {
  name: 'Login',

  data() {
    return {
      username: '',
      password: '',
      error: '',
      loading: false,
      showPassword: false,
    }
  },

  methods: {
    async login() {
      this.error = ''
      this.loading = true

      try {
        const response = await loginService.login(
          this.username,
          this.password
      )
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('role', response.data.role)
        saveUserProfile(response.data.user || response.data.profile || response.data)

        if (response.data.role === 0) {
          this.$router.push('/admin/products')
        } else if (response.data.role === 1) {
          this.$router.push('/products')
        } else {
          this.error = 'Not found user'
        }

        console.log(response.data)
      } catch (error) {
        this.error = error.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ'
          
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style src="../assets/css/theme-pages.css"></style>
<style src="../assets/css/theme.css"></style>
