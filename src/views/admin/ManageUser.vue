<template>
  <v-container class="py-8 px-4 px-md-8">
    <div class="ani-head">
      <div>
        <h1 class="ani-head-title">ผู้ใช้ทั้งหมด</h1>
        <p class="ani-head-sub my-6">จัดการบัญชีผู้ใช้ทั่วไป</p>
      </div>
      <v-spacer />
      <v-btn color="primary" large depressed class="text-none mb-2" @click="openCreateDialog">
        <v-icon left>mdi-account-plus</v-icon>
        เพิ่มผู้ใช้
      </v-btn>
    </div>

    <v-alert v-if="error" type="error" outlined>
      {{ error }}
    </v-alert>

    <v-text-field
      v-model="search"
      label="ค้นหาชื่อหรือนามสกุล"
      prepend-inner-icon="mdi-magnify"
      clearable
      outlined
      dense
      class="mb-4"
    />

    <v-card outlined>
      <v-data-table
        :headers="headers"
        :items="filteredUsers"
        :loading="loading"
        loading-text="กำลังโหลดรายชื่อผู้ใช้..."
        no-data-text="ไม่พบผู้ใช้"
        class="elevation-0"
      >
        <template slot="item.name" slot-scope="props">
          {{ getUserName(props.item) }}
        </template>

        <template slot="item.role" slot-scope="props">
          {{ formatRole(props.item.role) }}
        </template>

        <template slot="item.actions" slot-scope="props">
          <div class="d-flex justify-end">
            <v-btn icon small color="primary" aria-label="แก้ไขผู้ใช้" @click="openEditDialog(props.item)">
              <v-icon small>mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn icon small color="error" aria-label="ลบผู้ใช้" @click="confirmDelete(props.item)">
              <v-icon small>mdi-trash-can-outline</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="formDialog" max-width="650" persistent>
      <v-card flat class="ani-dialog">
        <div class="ani-dialog-head">
          <div class="ani-dot">
            <v-icon>{{ editingUser ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
          </div>
          <div>
            <div class="ani-dialog-title">{{ editingUser ? 'แก้ไขผู้ใช้' : 'เพิ่มผู้ใช้' }}</div>
            <div class="ani-dialog-sub">กรอกข้อมูลผู้ใช้ให้ครบถ้วนก่อนบันทึก</div>
          </div>
        </div>
        <v-card-text class="pa-6">
          <v-alert v-if="formError" type="error" dense text class="mb-5">
            {{ formError }}
          </v-alert>
          <v-form ref="userForm" @submit.prevent="saveUser">
            <v-text-field
              v-model.trim="form.username"
              label="ชื่อผู้ใช้"
              outlined
              dense
              class="ani-field"
              :rules="[requiredRule]"
              required
            />
            <v-text-field
              v-model="form.password"
              label="รหัสผ่าน"
              type="password"
              outlined
              dense
              class="ani-field"
              :hint="editingUser ? 'เว้นว่างหากไม่ต้องการเปลี่ยนรหัสผ่าน' : ''"
              :persistent-hint="Boolean(editingUser)"
              :rules="editingUser ? [] : [requiredRule]"
              :required="!editingUser"
            />
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.trim="form.name"
                  label="ชื่อ"
                  outlined
                  dense
                  class="ani-field"
                  :rules="[requiredRule]"
                  required
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.trim="form.lastname"
                  label="นามสกุล"
                  outlined
                  dense
                  class="ani-field"
                  :rules="[requiredRule]"
                  required
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.trim="form.gender"
                  label="เพศ"
                  outlined
                  dense
                  class="ani-field"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="form.age"
                  label="อายุ"
                  type="number"
                  min="0"
                  step="1"
                  outlined
                  dense
                  class="ani-field"
                  :rules="[requiredRule, ageRule]"
                  required
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text class="text-none" :disabled="saving" @click="closeFormDialog">
            ยกเลิก
          </v-btn>
          <v-btn color="primary" depressed class="text-none" :loading="saving" :disabled="saving" @click="saveUser">
            <v-icon left>mdi-content-save-outline</v-icon>
            บันทึก
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="430">
      <v-card flat class="ani-dialog">
        <div class="text-center pt-7 pb-3">
          <div class="ani-delete-icon"><v-icon color="error" size="32">mdi-trash-can-outline</v-icon></div>
          <div class="text-h6 font-weight-bold">ยืนยันการลบผู้ใช้</div>
        </div>

        <v-card-text class="text-center px-6 pb-5">
          ต้องการลบบัญชี {{ userToDelete && userToDelete.username }} ใช่หรือไม่?
          <div class="text-caption ani-muted mt-2">การดำเนินการนี้อาจไม่สามารถย้อนกลับได้</div>
        </v-card-text>

        <v-card-actions class="px-6 pb-6">
          <v-btn outlined class="btn-pill-outline text-none flex-grow-1" :disabled="deleting" @click="deleteDialog = false">
            ยกเลิก
          </v-btn>
          <v-btn color="error" depressed class="text-none flex-grow-1" :loading="deleting" :disabled="deleting" @click="deleteUser">
            ลบผู้ใช้
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import useManageUser from '@/hooks/useManageUser'

export default {
  name: 'ManageUser',

  mixins: [useManageUser],

  data() {
    return {
      headers: [
        { text: 'ชื่อ-นามสกุล', value: 'name' },
        { text: 'ชื่อผู้ใช้', value: 'username' },
        { text: 'อายุ', value: 'age' },
        { text: 'เพศ', value: 'gender' },
        { text: 'สิทธิ์', value: 'role' },
        { text: 'จัดการ', value: 'actions', sortable: false, align: 'end' },
      ],
    }
  },
}
</script>

<style src="../../assets/css/theme.css"></style>
