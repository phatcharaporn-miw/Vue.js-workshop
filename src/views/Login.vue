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
            <h2 class="text-h5 font-weight-black">
              {{ registering ? 'สมัครบัญชี' : 'เข้าสู่ระบบ' }}
            </h2>
            <p class="ani-muted mb-0">
              {{ registering ? 'กรอกข้อมูลเพื่อสร้างบัญชีผู้ใช้' : 'กรุณากรอกข้อมูลเพื่อเข้าใช้งาน' }}
            </p>
          </div>

          <v-form v-if="!registering" @submit.prevent="login">
            <v-text-field
              v-model="username"
              label="ชื่อผู้ใช้"
              prepend-inner-icon="mdi-account-outline"
              outlined
              rounded
              required
              autofocus
              class="ani-field"
            />

            <v-text-field
              v-model="password"
              label="รหัสผ่าน"
              prepend-inner-icon="mdi-lock-outline"
              :append-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              :type="showPassword ? 'text' : 'password'"
              outlined
              rounded
              required
              class="ani-field"
              @click:append="showPassword = !showPassword"
            />

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

          <v-form v-else ref="signupForm" @submit.prevent="register">
            <v-text-field
              v-model.trim="registration.username"
              label="ชื่อผู้ใช้"
              prepend-inner-icon="mdi-account-outline"
              outlined
              rounded
              required
              autofocus
              class="ani-field"
              :rules="[requiredRule]"
            />

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.trim="registration.name"
                  label="ชื่อ"
                  outlined
                  rounded
                  required
                  class="ani-field"
                  :rules="[requiredRule]"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.trim="registration.lastname"
                  label="นามสกุล"
                  outlined
                  rounded
                  required
                  class="ani-field"
                  :rules="[requiredRule]"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="registration.age"
                  label="อายุ"
                  type="number"
                  min="0"
                  step="1"
                  outlined
                  rounded
                  required
                  class="ani-field"
                  :rules="[requiredRule, ageRule]"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.trim="registration.gender"
                  label="เพศ (ไม่บังคับ)"
                  outlined
                  rounded
                  class="ani-field"
                />
              </v-col>
            </v-row>

            <v-text-field
              v-model="registration.password"
              label="รหัสผ่าน"
              prepend-inner-icon="mdi-lock-outline"
              :append-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              :type="showPassword ? 'text' : 'password'"
              outlined
              rounded
              required
              class="ani-field"
              :rules="[requiredRule]"
              @click:append="showPassword = !showPassword"
            />

            <v-text-field
              v-model="registration.confirmPassword"
              label="ยืนยันรหัสผ่าน"
              prepend-inner-icon="mdi-lock-check-outline"
              :type="showPassword ? 'text' : 'password'"
              outlined
              rounded
              required
              class="ani-field"
              :rules="[requiredRule, passwordConfirmationRule]"
            />

            <v-btn
              type="submit"
              color="primary"
              block
              large
              depressed
              class="ani-checkout mt-2 text-none"
              :loading="loading"
            >
              สมัครบัญชี
            </v-btn>
          </v-form>

          <div class="text-center mt-5">
            <span class="ani-muted">
              {{ registering ? 'มีบัญชีอยู่แล้ว?' : 'ยังไม่มีบัญชี?' }}
            </span>
            <v-btn
              text
              color="primary"
              class="text-none"
              :disabled="loading"
              @click="toggleRegistration"
            >
              {{ registering ? 'เข้าสู่ระบบ' : 'สมัครบัญชี' }}
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import loginService from '@/services/loginService'
import userService from '@/services/userService'
import { saveUserProfile } from '@/services/auth'

export default {
  name: 'Login',

  data() {
    return {
      username: '',
      password: '',
      loading: false,
      showPassword: false,
      registering: false,
      registration: {
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        lastname: '',
        gender: '',
        age: '',
      },
    }
  },

  methods: {
    requiredRule(value) {
      return (
        value !== undefined &&
        value !== null &&
        Boolean(String(value).trim())
      ) || 'กรุณากรอกข้อมูล'
    },

    ageRule(value) {
      return (
        value !== '' &&
        value !== null &&
        Number.isInteger(Number(value)) &&
        Number(value) >= 0
      ) || 'กรุณากรอกอายุเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป'
    },

    passwordConfirmationRule(value) {
      return value === this.registration.password || 'รหัสผ่านไม่ตรงกัน'
    },

    toggleRegistration() {
      this.registering = !this.registering
      this.showPassword = false
    },

    async register() {
      if (this.loading || !this.$refs.signupForm.validate()) return

      this.loading = true
      try {
        await userService.register({
          username: this.registration.username,
          password: this.registration.password,
          name: this.registration.name,
          lastname: this.registration.lastname,
          gender: this.registration.gender,
          age: Number(this.registration.age),
          role: 1,
        })

        this.username = this.registration.username
        this.password = ''
        this.registration.password = ''
        this.registration.confirmPassword = ''
        this.registering = false
        this.$toast('สมัครบัญชีเรียบร้อยแล้ว กรุณาเข้าสู่ระบบ', 'success')
      } catch (error) {
        const status = error.response && error.response.status
        const message = status === 409
          ? 'ชื่อผู้ใช้นี้มีผู้ใช้แล้ว กรุณาเลือกชื่อผู้ใช้อื่น'
          : (error.response && error.response.data && error.response.data.message) ||
            'สมัครบัญชีไม่สำเร็จ กรุณาลองอีกครั้ง'
        this.$toast(message, 'error')
      } finally {
        this.loading = false
      }
    },

    async login() {
      this.loading = true

      try {
        const response = await loginService.login(
          this.username,
          this.password
      )
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('role', response.data.role)
        saveUserProfile(response.data.user || response.data.profile || response.data)
        localStorage.removeItem('cart')

        if (response.data.role === 0) {
          // this.$toast('เข้าสู่ระบบสำเร็จ', 'success')
          this.$router.push('/admin/products')
        } else if (response.data.role === 1) {
          // this.$toast('เข้าสู่ระบบสำเร็จ', 'success')
          this.$router.push('/products')
        } else {
          this.$toast('ไม่พบข้อมูลผู้ใช้', 'error')
        }

        console.log(response.data)
      } catch (error) {
        this.$toast(error.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ', 'error')
          
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style src="../assets/css/theme-pages.css"></style>
<style src="../assets/css/theme.css"></style>
