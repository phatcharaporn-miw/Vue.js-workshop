import productService from '@/services/productService'
import { getCart, getCartKey, saveCart } from '@/services/cartStorage'
import { getToken } from '@/services/auth'

export default {
  // components: { ProductCard },

  data() {
    return {
      products: [],
      search: '',
      loading: false,
      error: '',

      sortBy: 'default',
      page: 1,
      perPage: 8,
      sortTabs: [
        { value: 'default', label: 'ทั้งหมด' },
      ],
    }
  },

  computed: {
    filteredProducts() {
      const keyword = (this.search || '').toLowerCase().trim()

      return this.products.filter((product) =>
        (product.productname || '').toLowerCase().includes(keyword) ||
        (product.productdetail || '').toLowerCase().includes(keyword),
      )
    },

    sortedProducts() {
      const list = [...this.filteredProducts]

      if (this.sortBy === 'priceAsc') {
        return list.sort((a, b) => Number(a.price) - Number(b.price))
      }
      if (this.sortBy === 'priceDesc') {
        return list.sort((a, b) => Number(b.price) - Number(a.price))
      }
      if (this.sortBy === 'name') {
        return list.sort((a, b) =>
          String(a.productname).localeCompare(String(b.productname), 'th'),
        )
      }
      return list
    },

    pageCount() {
      return Math.ceil(this.sortedProducts.length / this.perPage)
    },

    pagedProducts() {
      const start = (this.page - 1) * this.perPage
      return this.sortedProducts.slice(start, start + this.perPage)
    },
  },

  watch: {
    search() {
      this.page = 1
    },
    sortBy() {
      this.page = 1
    },
  },

  created() {
    this.fetchProducts()
  },

  methods: {
    async fetchProducts() {
      this.loading = true
      this.error = ''

      try {
        const response = await productService.getAll()
        const result = response.data
        const products = Array.isArray(result)
          ? result
          : result && Array.isArray(result.data)
          ? result.data
          : null

        if (!products) {
          throw new Error('รูปแบบข้อมูลสินค้าจาก API ไม่ถูกต้อง')
        }

        this.products = products
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    addToCart(product) {
      if (!getToken()) {
        this.$toast('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า', 'error')
        return
      }

      if (!getCartKey()) {
        this.$toast('ไม่พบข้อมูลบัญชีผู้ใช้สำหรับบันทึกตะกร้า', 'error')
        return
      }

      const cart = getCart()
      const id = product._id || product.id

      if (!id) {
        this.$toast('ไม่พบรหัสสินค้า', 'error')
        return
      }

      const existing = cart.find((item) => String(item.id) === String(id))
      const stock = Number(product.amount)

      if (existing) {
        if (existing.quantity + 1 > stock) {
          this.$toast('สินค้าในสต็อกไม่เพียงพอ', 'error')
          return
        }

        existing.quantity += 1
      } else {
        if (stock <= 0) {
          this.$toast('สินค้าหมด', 'error')
          return
        }

        cart.push({
          id,
          code: product.code,
          productname: product.productname,
          price: Number(product.price),
          quantity: 1,
          amount: stock,
          image: product.image,
        })
      }

      if (!saveCart(cart)) {
        this.$toast('ไม่สามารถบันทึกตะกร้าสินค้าได้', 'error')
        return
      }

      window.dispatchEvent(new Event('cart-updated'))

      this.$toast('เพิ่มลงตะกร้าสินค้าเรียบร้อย', 'success')
    },
  },
}