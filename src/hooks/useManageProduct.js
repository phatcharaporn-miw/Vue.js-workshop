import productService from '@/services/productService'

const emptyProduct = () => ({
  code: '',
  productname: '',
  productdetail: '',
  price: 0,
  amount: 0,
  image: '',
  imageFile: null,
})

const getId = (p) => p && (p._id || p.id)

export default {
  name: 'ManageProduct',

  data() {
    return {
      headers: [
        { text: 'ชื่อสินค้า', value: 'productname' },
        { text: 'ราคา', value: 'price' },
        { text: 'จำนวน', value: 'amount' },
        { text: 'จัดการ', value: 'actions', sortable: false, align: 'end' },
      ],
      products: [],
      loading: false,
      saving: false,
      deleting: false,
      formDialog: false,
      deleteDialog: false,
      editingProduct: null,
      productToDelete: null,
      form: emptyProduct(),
      formError: '',
      imageError: '',
      pageError: '',
      snackbar: false,
      message: '',
      requiredRule: (v) => Boolean(String(v).trim()) || 'กรุณากรอกข้อมูล',
    }
  },

  created() {
    this.fetchProducts()
  },

  methods: {
    async fetchProducts() {
      this.loading = true 
      this.pageError = ''
      try {
        const { data } = await productService.getAll()
        this.products = Array.isArray(data) ? data : data?.data || []
      } catch (e) {
        this.pageError = 'ไม่สามารถโหลดสินค้าได้'
      } finally {
        this.loading = false
      }
    },

    openCreateDialog() {
      this.openDialog(null, emptyProduct())
    },

    openEditDialog(product) {
      this.openDialog(product, {
        code: product.code || '',
        productname: product.productname || '',
        productdetail: product.productdetail || '',
        price: Number(product.price || 0),
        amount: Number(product.amount || 0),
        image: product.image || '',
        imageFile: null,
      })
    },

    openDialog(product, form) {
      this.editingProduct = product
      this.form = form
      this.formError = ''
      this.imageError = ''
      this.formDialog = true
    },

    closeFormDialog() {
      this.formDialog = false
      this.formError = ''
      this.imageError = ''
    },

    notify(message) {
      this.message = message
      this.snackbar = true
    },

    async saveProduct() {
      if (this.saving || !this.$refs.productForm.validate()) return

      const imageFile = Array.isArray(this.form.imageFile)
        ? this.form.imageFile[0]
        : this.form.imageFile

      if (!this.editingProduct && !imageFile) {
        this.imageError = 'กรุณาเลือกรูปสินค้า'
        return
      }

      this.saving = true
      this.formError = ''
      this.imageError = ''

      const data = new FormData()
      ;['code', 'productname', 'productdetail', 'price', 'amount'].forEach((key) =>
        data.append(key, String(this.form[key])),
      )
      if (imageFile) data.append('image', imageFile)
      else if (this.editingProduct && this.form.image) data.append('image', this.form.image)

      try {
        if (this.editingProduct) {
          const id = getId(this.editingProduct)
          if (!id) throw new Error('ไม่พบรหัสสินค้า จึงไม่สามารถแก้ไขได้')
          await productService.update(id, data)
          this.notify('แก้ไขสินค้าเรียบร้อย')
        } else {
          await productService.create(data)
          this.notify('เพิ่มสินค้าเรียบร้อย')
        }
        this.formDialog = false
        await this.fetchProducts()
      } catch (e) {
        this.formError = 'บันทึกสินค้าไม่สำเร็จ'
      } finally {
        this.saving = false
      }
    },

    confirmDelete(product) {
      this.productToDelete = product
      this.deleteDialog = true
    },

    async deleteProduct() {
      const id = getId(this.productToDelete)
      if (!id) {
        this.pageError = 'ไม่พบรหัสสินค้า จึงไม่สามารถลบได้'
        this.deleteDialog = false
        return
      }

      this.deleting = true
      try {
        await productService.delete(id)
        this.products = this.products.filter((p) => String(getId(p)) !== String(id))
        this.deleteDialog = false
        this.productToDelete = null
        this.notify('ลบสินค้าเรียบร้อย')
      } catch (e) {
        this.pageError = 'ไม่สามารถลบสินค้าได้'
        this.deleteDialog = false
      } finally {
        this.deleting = false
      }
    },

    formatPrice(value) {
      return Number(value || 0).toLocaleString('th-TH', {
        style: 'currency',
        currency: 'THB',
        maximumFractionDigits: 2,
      })
    },
  },
}