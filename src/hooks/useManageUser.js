import userService from '@/services/userService'

const isRegularUser = (user) => user && (user.role === 1 || user.role === '1')
const getUserId = (user) => user && (user._id || user.id)
const emptyUser = () => ({
  username: '',
  password: '',
  name: '',
  lastname: '',
  gender: '',
  age: '',
  role: 1,
})

function getUsersFromResponse(data) {
  let value = data

  for (let depth = 0; depth < 5; depth += 1) {
    if (Array.isArray(value)) {
      return value
    }

    if (!value || typeof value !== 'object') {
      return null
    }

    const nestedValue = value.users || value.data || value.result
    if (!nestedValue || nestedValue === value) {
      return null
    }

    value = nestedValue
  }

  return null
}

export default {
  data() {
    return {
      users: [],
      search: '',
      loading: false,
      error: '',
      formDialog: false,
      deleteDialog: false,
      editingUser: null,
      userToDelete: null,
      form: emptyUser(),
      formError: '',
      saving: false,
      deleting: false,
      requiredRule: (value) => Boolean(String(value).trim()) || 'กรุณากรอกข้อมูล',
      ageRule: (value) =>
        (Number.isInteger(Number(value)) && Number(value) >= 0) || 'กรุณากรอกอายุเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป',
    }
  },

  computed: {
    filteredUsers() {
      const keyword = this.search.trim().toLocaleLowerCase()

      if (!keyword) {
        return this.users.filter(isRegularUser)
      }

      return this.users.filter((user) => {
        if (!isRegularUser(user)) return false
        const name = [user.name, user.lastname, user.firstName, user.lastName]
          .filter(Boolean)
          .join(' ')
          .toLocaleLowerCase()

        return name.includes(keyword) ||
          String(user.username || '').toLocaleLowerCase().includes(keyword)
      })
    },
  },

  created() {
    this.fetchUsers()
  },

  methods: {
    async fetchUsers() {
      this.loading = true
      this.error = ''

      try {
        const { data } = await userService.getAll()
        const users = getUsersFromResponse(data)

        if (!users) {
          throw new Error('รูปแบบข้อมูลผู้ใช้จาก API ไม่ถูกต้อง')
        }

        this.users = users.filter(isRegularUser)
      } catch (error) {
        this.error =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          'ไม่สามารถโหลดรายชื่อผู้ใช้ได้'
      } finally {
        this.loading = false
      }
    },

    getUserName(user) {
      return [
        user.name || user.firstName,
        user.lastname || user.lastName,
      ]
        .filter(Boolean)
        .join(' ') || 'ไม่ระบุชื่อ'
    },

    formatRole(role) {
      if (role === 0 || role === '0') {
        return 'แอดมิน'
      }

      if (role === 1 || role === '1') {
        return 'ผู้ใช้'
      }

      return 'ไม่ระบุ'
    },

    openCreateDialog() {
      this.editingUser = null
      this.form = emptyUser()
      this.formError = ''
      this.formDialog = true
    },

    openEditDialog(user) {
      if (!isRegularUser(user)) return

      this.editingUser = user
      this.form = {
        username: user.username || '',
        password: '',
        name: user.name || user.firstName || '',
        lastname: user.lastname || user.lastName || '',
        gender: user.gender || '',
        age: user.age === undefined || user.age === null ? '' : Number(user.age),
        role: 1,
      }
      this.formError = ''
      this.formDialog = true
    },

    closeFormDialog() {
      this.formDialog = false
      this.formError = ''
    },

    async saveUser() {
      if (this.saving || !this.$refs.userForm.validate()) return

      const id = getUserId(this.editingUser)
      if (this.editingUser && (!isRegularUser(this.editingUser) || !id)) {
        this.formError = 'ไม่พบข้อมูลผู้ใช้ที่ต้องการแก้ไข'
        return
      }

      this.saving = true
      this.formError = ''
      const payload = {
        name: this.form.name.trim(),
        lastname: this.form.lastname.trim(),
        gender: this.form.gender.trim(),
        age: Number(this.form.age),
        role: 1,
      }

      const username = this.form.username.trim()
      const originalUsername = this.editingUser && this.editingUser.username
      if (!this.editingUser || username !== originalUsername) {
        payload.username = username
      }

      if (this.form.password) payload.password = this.form.password

      try {
        if (this.editingUser) {
          await userService.update(id, payload)
          this.notify('แก้ไขผู้ใช้เรียบร้อย')
        } else {
          await userService.create(payload)
          this.notify('เพิ่มผู้ใช้เรียบร้อย')
        }
        this.formDialog = false
        await this.fetchUsers()
      } catch (error) {
        const status = error.response && error.response.status
        this.formError = status === 409
          ? 'ข้อมูลขัดแย้งกัน อาจมีผู้ใช้ชื่อบัญชีนี้อยู่แล้ว กรุณาตรวจสอบชื่อผู้ใช้'
          : (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            'บันทึกข้อมูลผู้ใช้ไม่สำเร็จ'
        this.$toast(this.formError, 'error')
      } finally {
        this.saving = false
      }
    },

    confirmDelete(user) {
      if (!isRegularUser(user)) return
      this.userToDelete = user
      this.deleteDialog = true
    },

    async deleteUser() {
      const id = getUserId(this.userToDelete)
      if (!id || !isRegularUser(this.userToDelete)) {
        this.error = 'ไม่พบผู้ใช้ role = 1 ที่ต้องการลบ'
        this.deleteDialog = false
        this.$toast(this.error, 'error')
        return
      }

      this.deleting = true
      this.error = ''
      try {
        await userService.delete(id)
        this.users = this.users.filter((user) => String(getUserId(user)) !== String(id))
        this.deleteDialog = false
        this.userToDelete = null
        this.notify('ลบผู้ใช้เรียบร้อย')
      } catch (error) {
        this.error =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          'ไม่สามารถลบผู้ใช้ได้'
        this.deleteDialog = false
        this.$toast(this.error, 'error')
      } finally {
        this.deleting = false
      }
    },

    notify(message) {
      this.$toast(message, 'success')
    },
  },
}
