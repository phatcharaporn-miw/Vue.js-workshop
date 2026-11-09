<template>
  <div class="ani-catalog">
    <v-container fluid class="px-4 px-md-10">
      <div class="ani-hero">
        <h1 class="ani-mega">Comic V</h1>
        <img class="ani-hero-img" src="@/assets/chainsaw-man.png" alt="Chainsaw Man" />
      </div>
 
      <div class="ani-search-band my-5">
        <v-text-field
          v-model="search"
          placeholder="ค้นหาจากชื่อสินค้า หรือรายละเอียด"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          color="primary"
          class="ani-search"
        />
      </div>

      <div class="ani-toolbar">
        <button
          v-for="tab in sortTabs"
          :key="tab.value"
          type="button"
          class="ani-tab"
          :class="{ 'is-active': sortBy === tab.value }"
          @click="sortBy = tab.value"
        >
          {{ tab.label }}
        </button>
 
        <span class="ani-count">{{ filteredProducts.length }} รายการ</span>
      </div>
 
      <v-alert v-if="error" type="error" text border="left" class="mb-6">{{ error }}</v-alert>
 
      <div v-else>
        <v-row v-if="pagedProducts.length > 0" class="ani-grid">
          <v-col
            v-for="product in pagedProducts"
            :key="product._id || product.id || product.code"
            cols="6"
            sm="4"
            md="3"
            class="product-column"
          >
            <ProductCard :product="product" @add-to-cart="addToCart" />
          </v-col>
        </v-row>
 
        <v-card v-else flat class="empty-state pa-8 pa-md-12 text-center">
          <div class="empty-icon mx-auto mb-5"><v-icon size="40">mdi-magnify</v-icon></div>
          <h3 class="text-h6 font-weight-bold">ไม่พบสินค้าที่ค้นหา</h3>
          <p class="ani-muted mb-5">ลองเปลี่ยนคำค้นหา แล้วค้นหาอีกครั้ง</p>
          <v-btn outlined class="btn-pill-outline text-none" @click="search = ''">
            <v-icon left>mdi-refresh</v-icon>
            ดูสินค้าทั้งหมด
          </v-btn>
        </v-card>
 
        <v-pagination
          v-if="pageCount > 1"
          v-model="page"
          :length="pageCount"
          :total-visible="5"
          class="ani-pager"
          color="primary"
        />
      </div>
    </v-container>
 
    <v-snackbar v-model="snackbar" :timeout="2000" top right>
      <v-icon color="success" class="mr-2">mdi-check-circle</v-icon>
      {{ message }}
      <template slot="action" slot-scope="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">ปิด</v-btn>
      </template>
    </v-snackbar>

    <Footer/>
  </div>
</template>

<script>
import Footer from "@/components/Footer.vue";
import ProductCard from "@/components/ProductCard.vue";
import useProducts from "@/hooks/useProducts";


export default {
  name: "Products",

  mixins: [useProducts],

  components: {
    ProductCard,
    Footer,
  },
};
</script>

 <style src="../../assets/css/theme.css"></style>
 <style src="../../assets/css/theme-pages.css"></style>
