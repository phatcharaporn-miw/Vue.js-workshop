<template>
  <v-container class="py-8 px-4 px-md-8">
    <div class="ani-head">
      <div>
        <h1 class="ani-head-title">จัดการสินค้า</h1>
        <p class="ani-head-sub">จัดการรายการสินค้า ราคา และสต็อกของร้านค้า</p>
      </div>
      <v-spacer />
      <v-btn color="primary" large depressed class="text-none mb-2" @click="openCreateDialog">
        <v-icon left>mdi-plus</v-icon>
        เพิ่มสินค้าใหม่
      </v-btn>
    </div>

    <v-alert v-if="pageError" type="error" dense text border="left" class="mb-6">
      {{ pageError }}
    </v-alert>

    <v-row class="mb-5">
      <v-col cols="12" sm="6" md="4">
        <v-card flat class="ani-card">
          <div class="ani-stat">
            <div class="ani-dot"><v-icon>mdi-cube-outline</v-icon></div>
            <div>
              <div class="label">สินค้าทั้งหมด</div>
              <div><span class="num">{{ products.length }}</span><span class="unit">รายการ</span></div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card flat class="ani-card">
          <div class="ani-stat">
            <div class="ani-dot"><v-icon>mdi-cash-multiple</v-icon></div>
            <div>
              <div class="label">รายการที่มีราคา</div>
              <div>
                <span class="num">
                  {{ products.filter(p => Number(p.price) >= 0 && p.price !== null && p.price !== '').length }}
                </span>
                <span class="unit">รายการ</span>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card flat class="ani-card">
          <div class="ani-stat is-alert">
            <div class="ani-dot" style="background:#FF5252"><v-icon>mdi-package-down</v-icon></div>
            <div>
              <div class="label">สินค้าหมดสต็อก</div>
              <div>
                <span class="num">{{ products.filter(p => Number(p.amount) <= 0).length }}</span>
                <span class="unit">รายการ</span>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Product Table -->
    <v-card flat class="ani-card ani-table-wrap">
      <div class="ani-card-head">
        <div class="ani-dot"><v-icon>mdi-format-list-bulleted</v-icon></div>
        <div>
          <div>รายการสินค้า</div>
          <div class="ani-muted" style="font-size:12px;font-weight:500">
            ดูและจัดการข้อมูลสินค้าทั้งหมดในระบบ
          </div>
        </div>
        <v-spacer />
        <span class="ani-pill-chip">{{ products.length }} รายการ</span>
      </div>

      <v-data-table
        :headers="headers"
        :items="products"
        :loading="loading"
        loading-text="กำลังโหลดสินค้า..."
        no-data-text="ยังไม่มีสินค้า"
        :items-per-page="10"
        :footer-props="{
          'items-per-page-options': [5, 10, 20, 50],
          'items-per-page-text': 'จำนวนต่อหน้า'
        }"
      >
        <template slot="item.productname" slot-scope="props">
          <div class="d-flex align-center py-2">
            <div class="ani-thumb-box mr-3">
              <v-icon small>mdi-package-variant-closed</v-icon>
            </div>
            <div class="ani-name">{{ props.item.productname }}</div>
          </div>
        </template>

        <template slot="item.price" slot-scope="props">
          <span class="ani-price">{{ formatPrice(props.item.price) }}</span>
        </template>

        <template slot="item.amount" slot-scope="props">
          <span
            class="ani-stock-chip"
            :class="
              Number(props.item.amount) <= 0 ? 'out'
                : Number(props.item.amount) <= 5 ? 'low' : 'ok'
            "
          >
            {{ props.item.amount }} ชิ้น
          </span>
        </template>

        <template slot="item.actions" slot-scope="props">
          <div class="d-flex align-center justify-end">
            <v-btn icon small color="primary" aria-label="แก้ไขสินค้า" @click="openEditDialog(props.item)">
              <v-icon small>mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn icon small color="error" aria-label="ลบสินค้า" @click="confirmDelete(props.item)">
              <v-icon small>mdi-trash-can-outline</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create / Edit Dialog -->
    <v-dialog v-model="formDialog" max-width="650" persistent>
      <v-card flat class="ani-dialog">
        <div class="ani-dialog-head">
          <div class="ani-dot">
            <v-icon>{{ editingProduct ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
          </div>
          <div>
            <div class="ani-dialog-title">{{ editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่' }}</div>
            <div class="ani-dialog-sub">กรอกข้อมูลสินค้าให้ครบถ้วนก่อนบันทึก</div>
          </div>
        </div>

        <v-card-text class="pa-6">
          <v-alert v-if="formError" type="error" dense text class="mb-5">{{ formError }}</v-alert>

          <v-form ref="productForm" @submit.prevent="saveProduct">
            <div class="ani-form-title">
              <v-icon small>mdi-information-outline</v-icon>
              ข้อมูลทั่วไป
            </div>

            <v-text-field
              v-model.trim="form.productname"
              label="ชื่อสินค้า"
              placeholder="ระบุชื่อสินค้า"
              outlined
              dense
              class="ani-field"
              :rules="[requiredRule]"
              required
            />

            <v-textarea
              v-model.trim="form.productdetail"
              label="รายละเอียดสินค้า"
              placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)"
              rows="3"
              auto-grow
              outlined
              dense
              class="ani-field"
            />

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="form.price"
                  label="ราคา (บาท)"
                  placeholder="0.00"
                  type="number"
                  min="0"
                  outlined
                  dense
                  class="ani-field"
                  :rules="[requiredRule, nonNegativeRule]"
                  required
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="form.amount"
                  label="จำนวนคงเหลือ"
                  placeholder="0"
                  type="number"
                  min="0"
                  step="1"
                  outlined
                  dense
                  class="ani-field"
                  :rules="[requiredRule, nonNegativeRule]"
                  required
                />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <div class="ani-form-title">
              <v-icon small>mdi-image-outline</v-icon>
              รูปภาพสินค้า
            </div>

            <v-file-input
              v-model="form.imageFile"
              label="เลือกรูปสินค้า"
              placeholder="คลิกเพื่อเลือกไฟล์รูปภาพ"
              accept="image/*"
              show-size
              outlined
              dense
              class="ani-field"
              prepend-icon=""
              :error-messages="imageError"
              @change="imageError = ''"
            />

            <v-alert v-if="editingProduct && editingProduct.image" type="info" dense text class="mt-1">
              หากไม่เลือกรูปใหม่ ระบบจะใช้รูปเดิม
            </v-alert>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-5">
          <v-spacer />
          <v-btn text class="text-none" :disabled="saving" @click="closeFormDialog">ยกเลิก</v-btn>
          <v-btn
            color="primary"
            depressed
            class="text-none"
            :loading="saving"
            :disabled="saving"
            @click="saveProduct"
          >
           
            {{ editingProduct ? 'บันทึกการแก้ไข' : 'บันทึกสินค้า' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="430">
      <v-card flat class="ani-dialog">
        <div class="text-center pt-7 pb-3">
          <div class="ani-delete-icon"><v-icon color="error" size="32">mdi-trash-can-outline</v-icon></div>
          <div class="text-h6 font-weight-bold">ยืนยันการลบสินค้า</div>
        </div>

        <v-card-text class="text-center px-6 pb-5">
          คุณต้องการลบสินค้า
          <strong>{{ productToDelete && productToDelete.productname }}</strong>
          ใช่หรือไม่?
          <div class="text-caption ani-muted mt-2">การดำเนินการนี้อาจไม่สามารถย้อนกลับได้</div>
        </v-card-text>

        <v-card-actions class="px-6 pb-6">
          <v-btn outlined class="btn-pill-outline text-none flex-grow-1" :disabled="deleting" @click="deleteDialog = false">
            ยกเลิก
          </v-btn>
          <v-btn color="error" depressed class="text-none flex-grow-1" :loading="deleting" @click="deleteProduct">
            <v-icon left>mdi-delete-outline</v-icon>
            ลบสินค้า
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="2500" top right>
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">ปิด</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import useManageProduct from "@/hooks/useManageProduct";

export default {
  name: "ManageProduct",
  mixins: [useManageProduct],
};
</script>

<style src="../../assets/css/theme.css"></style>


