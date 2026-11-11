<!-- <template>
  <v-app>
    <router-view/>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script> -->

<template>
  <v-app>
    <router-view />

    <!-- Comic Verse Toast -->
    <transition name="comic-toast">
      <div
        v-if="toast.show"
        class="comic-toast"
        :class="`comic-toast--${toast.type}`"
        role="status"
        aria-live="polite"
      >
        <div class="comic-toast-icon">
          <v-icon color="white">
            {{ toast.type === "success" ? "mdi-check-circle" : "mdi-alert-circle" }}
          </v-icon>
        </div>

        <div class="comic-toast-content">
          <div class="comic-toast-title">
            {{ toast.title }}
          </div>

          <div class="comic-toast-message">
            {{ toast.message }}
          </div>
        </div>

        <button
          class="comic-toast-close"
          aria-label="ปิดการแจ้งเตือน"
          @click="dismissToast"
        >
          ×
        </button>

        <div class="comic-toast-progress"></div>
      </div>
    </transition>

  </v-app>
</template>

<script>
export default {
  name: "App",

  data() {
    return {
      toast: {
        show: false,
        type: "success",
        title: "",
        message: "",
      },
      toastTimer: null,
    };
  },

  created() {
    this.$root.$on("show-toast", this.showToast);
  },

  beforeDestroy() {
    this.$root.$off("show-toast", this.showToast);
    clearTimeout(this.toastTimer);
  },

  methods: {
    showToast(payload, type = "success") {
      const notification = typeof payload === "string"
        ? { message: payload, type }
        : payload || {};
      const notificationType = notification.type === "error" ? "error" : "success";

      clearTimeout(this.toastTimer);

      this.toast.type = notificationType;
      this.toast.title = notificationType === "success" ? "สำเร็จ" : "เกิดข้อผิดพลาด";
      this.toast.message = notification.message || "";
      this.toast.show = true;

      this.toastTimer = setTimeout(() => {
        this.toast.show = false;
      }, 3500);
    },
    dismissToast() {
      clearTimeout(this.toastTimer);
      this.toast.show = false;
    },
  },
};
</script>

<style>
.comic-toast {
  position: fixed;
  top: 95px;
  right: 25px;
  z-index: 99999;

  display: flex;
  align-items: center;
  gap: 14px;

  width: 380px;
  min-height: 85px;
  padding: 16px;

  background: #fff;
  color: #000;
  border: 2px solid #000;
  border-left: 6px solid #ff4b24;

  box-shadow: 5px 5px 0 #000;
}

.comic-toast-icon {
  width: 45px;
  height: 45px;
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #ff4b24;
  color: #fff;
  font-size: 20px;
}

.comic-toast-content {
  flex: 1;
  min-width: 0;
}

.comic-toast-title {
  font-size: 15px;
  font-weight: 900;
  margin-bottom: 5px;
}

.comic-toast-message {
  font-size: 13px;
  color: #555;
  overflow-wrap: anywhere;
}

.comic-toast-close {
  border: none;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
}

.comic-toast--error {
  background: #111;
  color: #fff;
  border-color: #ff4b24;
}

.comic-toast--error .comic-toast-title {
  color: #ff4b24;
}

.comic-toast--error .comic-toast-message {
  color: #eee;
}

.comic-toast--error .comic-toast-close {
  color: #fff;
}

.comic-toast-icon .v-icon {
  color: #fff;
}

.comic-toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  width: 100%;
  background: #ff4b24;
  animation: comic-progress 3.5s linear forwards;
  transform-origin: left;
}

@keyframes comic-progress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

.comic-toast-enter-active,
.comic-toast-leave-active {
  transition: all 0.3s ease;
}

.comic-toast-enter,
.comic-toast-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
</style>