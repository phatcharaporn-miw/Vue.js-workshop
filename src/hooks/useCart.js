import productService from "@/services/productService";
import orderService from "@/services/orderservice";
import api from "@/services/api";
import { getToken } from "@/services/auth";

const fallbackImage = "https://placehold.co/200x200?text=Product";

export default {
  data() {
    return {
      cart: [],
      selectedIds: [],
      checkingOut: false,
      checkoutError: "",
    };
  },

  created() {
    this.cart = JSON.parse(localStorage.getItem("cart") || "[]");
    this.selectedIds = this.cart.map((item) => String(item.id));
  },

  computed: {
    selectAll: {
      get() {
        return (
          this.cart.length > 0 && this.selectedIds.length === this.cart.length
        );
      },
      set(checked) {
        this.selectedIds = checked
          ? this.cart.map((item) => String(item.id))
          : [];
      },
    },

    selectedItems() {
      return this.cart.filter((item) =>
        this.selectedIds.includes(String(item.id)),
      );
    },

    selectedQuantity() {
      return this.selectedItems.reduce((sum, item) => {
        return sum + Number(item.quantity);
      }, 0);
    },

    selectedTotal() {
      return this.selectedItems.reduce((sum, item) => {
        return sum + Number(item.price) * Number(item.quantity);
      }, 0);
    },
  },

  methods: {
    getProductImage(item) {
      const image = item && item.image;
      const imagePath =
        typeof image === "string"
          ? image.trim()
          : image && typeof image === "object"
          ? image.url || image.path || image.filename || ""
          : "";

      if (!imagePath) {
        return fallbackImage;
      }

      if (/^(?:https?:)?\/\//i.test(imagePath)) {
        return imagePath;
      }

      return new URL(imagePath.replace(/^\/+/, ""), `${api.defaults.baseURL}/`).toString();
    },

    async checkout() {
      if (this.selectedItems.length === 0 || this.checkingOut) {
        return;
      }

      this.checkoutError = "";
      const token = getToken();

      if (!token) {
        this.$router.push("/login");
        return;
      }

      this.checkingOut = true;

      try {
        const items = await Promise.all(
          this.selectedItems.map(async (item) => {
            let productCode = item.code || item.productCode;

            if (!productCode && item.id) {
              const response = await productService.getById(item.id);
              const result = response.data;
              const product = result && result.data ? result.data : result;
              productCode = product && (product.code || product.productCode);
            }

            if (productCode === undefined || productCode === null || productCode === "") {
              throw new Error(
                `ไม่พบรหัสสินค้าของ "${item.productname}" กรุณาลบสินค้าแล้วเพิ่มลงตะกร้าใหม่`,
              );
            }

            return {
              productCode: String(productCode),
              quantity: Number(item.quantity),
              totalPrice: Number(item.price) * Number(item.quantity),
            };
          }),
        );

        const payload = {
          ponumber: `PO-${Date.now()}`,
          items,
          totalAmount: items.reduce((sum, item) => sum + item.totalPrice, 0),
        };

        await orderService.create(payload);

        const purchasedIds = new Set(
          this.selectedItems.map((item) => String(item.id)),
        );
        this.cart = this.cart.filter(
          (item) => !purchasedIds.has(String(item.id)),
        );
        this.selectedIds = [];
        this.saveCart();
        window.dispatchEvent(new Event("cart-updated"));

        alert("สั่งซื้อสำเร็จ");
        this.$router.push("/my-orders");
      } catch (error) {
        console.error("Create order error:", error.response?.data || error);

        this.checkoutError =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          "ไม่สามารถสั่งซื้อได้ กรุณาลองอีกครั้ง";
      } finally {
        this.checkingOut = false;
      }
    },
    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.cart));

      this.$root.$emit("cart-updated");
    },

    increaseQuantity(item) {
      if (item.quantity < item.amount) {
        item.quantity++;
        this.saveCart();
      }
    },

    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--;
        this.saveCart();
      }
    },

    removeItem(id) {
      this.cart = this.cart.filter((item) => item.id !== id);
      this.selectedIds = this.selectedIds.filter(
        (selectedId) => selectedId !== String(id),
      );

      this.saveCart();
    },
  },
};