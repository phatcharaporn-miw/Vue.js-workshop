<template>
  <div>
    <h1>API CONNECT</h1>
    <v-btn color="success" @click="newItem()">newItem</v-btn>
    <v-row>
      <v-col cols="3" v-for="(item, index) in apidata" :key="index">
        <div>
          <v-card width="350">
            <v-img :src="adminImage" />
            <v-card-title primary-title
              >{{ item.name }} {{ item.lastname }}</v-card-title
            >
            <v-card-actions>
              <v-btn color="success" @click="editItem(item)">edit</v-btn>
              <v-btn color="error" @click="deleteItem(item)">delete</v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogedit" max-width="500px">
      <v-card>
        <v-card-title primary-title>
          {{ savemode }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-text-field
                name="name"
                label="name"
                id="name"
                v-model="postdata.name"
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                name="lastname"
                label="lastname"
                id="lastname"
                v-model="postdata.lastname"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="closeItem()">cancel</v-btn>
          <v-btn color="info" text @click="saveSelect()">save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import adminImage from "@/assets/admin.jpg";

export default {
  data() {
    return {
      apidata: [],
      adminImage,
      id: "",
      postdata: {
        //ส่งข้อมูล
        username: "",
        password: "",
        name: "",
        lastname: "",
      },
      postdefault: {
        //เคลียข้อมูล
        username: "",
        password: "",
        name: "",
        lastname: "",
      },
      dialogedit: false,
    };
  },
  computed: {
    savemode() {
      return this.id === "" ? "NewItem" : "EditItem";
    },
  },
  created() {
    this.getData();
  },
  methods: {
    newItem() {
      this.id = "";
      this.postdata = { ...this.postdefault };
      this.dialogedit = true;
    },
    editItem(item) {
      this.id = item._id;
      this.postdata = { ...item };
      this.dialogedit = true;
    },
    closeItem() {
      this.id = "";
      this.postdata = { ...this.postdefault };
      this.dialogedit = false;
    },
    saveSelect() {
      if (this.id != "") {
        this.savePutdata()
      } else this.savePostdata()
    },
    getData() {
      this.axios.get("http://localhost:3000/users",{
        headers: {
            Authorization: 'Bearer $token'
        }
      }).then((response) => {
        this.apidata = response.data.data;
      });
    },
    async savePostdata() {
      try {
        const { data } = await this.axios.post(
          "http://localhost:3000/register",
          this.postdata,
        );
        console.log(data);
        this.$toast("เพิ่มผู้ใช้เรียบร้อย", "success");
        this.getData();
        this.closeItem();
      } catch (error) {
        console.log(error);
        this.$toast(error.response?.data?.message || "เพิ่มผู้ใช้ไม่สำเร็จ", "error");
      }
    },
    async savePutdata() {
      try {
        const { data } = await this.axios.put(
          "http://localhost:3000/users/"+this.id,
          {
            name: this.postdata.name,
            lastname: this.postdata.lastname,
          },
        );
        console.log(data);
        this.$toast("แก้ไขผู้ใช้เรียบร้อย", "success");
        this.getData();
        this.closeItem();
      } catch (error) {
        console.log(error);
        this.$toast(error.response?.data?.message || "แก้ไขผู้ใช้ไม่สำเร็จ", "error");
      }
    },
    async deleteItem(item) {
        if (confirm('Delete ' + item.name))
      try {
        const { data } = await this.axios.delete(
          "http://localhost:3000/users/"+item._id,
        );
        console.log(data);
        this.$toast("ลบผู้ใช้เรียบร้อย", "success");
        this.getData();
        this.closeItem();
      } catch (error) {
        console.log(error);
        this.$toast(error.response?.data?.message || "ลบผู้ใช้ไม่สำเร็จ", "error");
      }
    },
  },
};
</script>

<style></style>
