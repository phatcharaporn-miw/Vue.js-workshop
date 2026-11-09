<template>
  <v-container class="py-8">
    <div class="ani-head">
      <div class="ani-head-icon"><v-icon size="34">mdi-account-circle-outline</v-icon></div>
      <div>
        <h1 class="ani-head-title">โปรไฟล์ของฉัน</h1>
        <p class="ani-head-sub">ข้อมูลบัญชีผู้ใช้ที่เข้าสู่ระบบ</p>
      </div>
    </div>

    <v-alert v-if="error" type="error" text rounded="xl">{{ error }}</v-alert>

    <div v-if="loading && !profile" class="text-center py-10">
      <v-progress-circular indeterminate color="primary" />
      <p class="ani-muted mt-3">กำลังโหลดข้อมูลโปรไฟล์...</p>
    </div>

    <v-card v-else-if="profile" class="ani-card ani-profile mx-auto" flat>
      <div class="ani-profile-top">
        <v-avatar size="96" class="ani-avatar">
          <v-icon color="white" size="52">mdi-account</v-icon>
        </v-avatar>
        <div class="ani-profile-name">{{ fullName || profile.username || 'โปรไฟล์ผู้ใช้' }}</div>
        <span class="ani-role">{{ roleLabel }}</span>
      </div>

      <div class="ani-info-grid">
        <div class="ani-info">
          <div class="ico"><v-icon>mdi-card-account-details-outline</v-icon></div>
          <div><div class="k">ชื่อ-นามสกุล</div><div class="v">{{ fullName || '-' }}</div></div>
        </div>
        <div class="ani-info">
          <div class="ico"><v-icon>mdi-account-outline</v-icon></div>
          <div><div class="k">ชื่อผู้ใช้</div><div class="v">{{ profile.username || '-' }}</div></div>
        </div>
        <div class="ani-info">
          <div class="ico"><v-icon>mdi-email-outline</v-icon></div>
          <div><div class="k">อีเมล</div><div class="v">{{ profile.email || '-' }}</div></div>
        </div>
        <div class="ani-info">
          <div class="ico"><v-icon>mdi-phone-outline</v-icon></div>
          <div><div class="k">เบอร์โทรศัพท์</div><div class="v">{{ profile.phone || '-' }}</div></div>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import userService from '@/services/userService'
import { getSavedUserProfile, getTokenPayload } from '@/services/auth'

function unwrapUser(responseData) {
  let value = responseData

  for (let depth = 0; depth < 4; depth += 1) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null
    }

    if (
      value._id ||
      value.id ||
      value.username ||
      value.email ||
      value.name ||
      value.firstname
    ) {
      return value
    }

    value = value.user || value.profile || value.data
  }

  return null
}

export default {
  name: 'Profile',

  data() {
    return {
      profile: null,
      loading: false,
      error: '',
    }
  },

  computed: {
    fullName() {
      if (!this.profile) {
        return ''
      }

      return (
        this.profile.fullName ||
        [this.profile.name || this.profile.firstname || this.profile.firstName,
          this.profile.lastname || this.profile.lastName]
          .filter(Boolean)
          .join(' ')
      )
    },

    roleLabel() {
      const role = this.profile && this.profile.role !== undefined
        ? this.profile.role
        : localStorage.getItem('role')

      if (role === 0 || role === '0') {
        return 'แอดมิน'
      }

      if (role === 1 || role === '1') {
        return 'ผู้ใช้'
      }

      return 'ไม่ระบุ'
    },
  },

  created() {
    this.fetchProfile()
  },

  methods: {
    async fetchProfile() {
      const payload = getTokenPayload() || {}
      const tokenUser = payload.user || payload.profile || payload
      this.profile = {
        ...tokenUser,
        ...(getSavedUserProfile() || {}),
      }

      const userId =
        this.profile._id ||
        this.profile.id ||
        this.profile.userId ||
        payload.userId ||
        payload.sub

      if (!userId) {
        if (!this.hasProfileData(this.profile)) {
          this.error = 'ไม่พบข้อมูลโปรไฟล์ใน token หรือข้อมูลการเข้าสู่ระบบ'
        }
        return
      }

      this.loading = true
      this.error = ''

      try {
        const { data } = await userService.getById(userId)
        const user = unwrapUser(data)

        if (!user) {
          throw new Error('รูปแบบข้อมูลโปรไฟล์จาก API ไม่ถูกต้อง')
        }

        this.profile = { ...this.profile, ...user }
      } catch (error) {
        this.error =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          'ไม่สามารถโหลดข้อมูลโปรไฟล์ล่าสุดได้'
      } finally {
        this.loading = false
      }
    },

    hasProfileData(profile) {
      return Boolean(
        profile &&
          (profile.username ||
            profile.email ||
            profile.name ||
            profile.firstname ||
            profile.firstName),
      )
    },
  },
}
</script>

<style src="../assets/css/theme-pages.css"></style>
<style src="../assets/css/theme.css"></style>
