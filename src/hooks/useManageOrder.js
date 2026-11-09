import orderService from "@/services/orderservice";

function getOrdersFromResponse(data) {
  let value = data;

  for (let depth = 0; depth < 5; depth += 1) {
    if (Array.isArray(value)) {
      return value;
    }

    if (!value || typeof value !== "object") {
      return null;
    }

    const nestedValue = value.orders || value.data || value.result;
    if (!nestedValue || nestedValue === value) {
      return null;
    }

    value = nestedValue;
  }

  return null;
}

export default {
  name: "ManageOrder",

  data() {
    return {
      orders: [],
      loading: false,
      error: "",
    };
  },

  created() {
    this.fetchOrders();
  },

  methods: {
    async fetchOrders() {
      this.loading = true;
      this.error = "";

      try {
        const response = await orderService.getAll();
        console.log("Orders API:", response.data);

        const result = getOrdersFromResponse(response.data);

        if (!result) {
          throw new Error("รูปแบบข้อมูลคำสั่งซื้อไม่ถูกต้อง");
        }

        this.orders = result;
      } catch (error) {
        console.error("โหลดคำสั่งซื้อไม่สำเร็จ:", error);

        this.error = "ไม่สามารถโหลดคำสั่งซื้อได้";
      } finally {
        this.loading = false;
        console.log("Loading:", this.loading);
      }
    },

    getBuyerName(buyer) {
      if (!buyer || typeof buyer !== "object") {
        return "";
      }

      return (
        buyer.name || buyer.lastname
          .filter(Boolean)
          .join(" ")
      );
    },

    getProductImage(item) {
      if (!item || !item.image) {
        return "";
      }

      if (item.image.startsWith("http")) {
        return item.image;
      }

      return `http://localhost:3000/${item.image.replace(/^\/+/, "")}`;
    },

    formatPrice(value) {
      return Number(value || 0).toLocaleString("th-TH", {
        style: "currency",
        currency: "THB",
        maximumFractionDigits: 2,
      });
    },

    formatDate(value) {
      if (!value) {
        return "ไม่ระบุวันที่";
      }

      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        return "ไม่ระบุวันที่";
      }

      return date.toLocaleString("th-TH");
    },
  },
};
