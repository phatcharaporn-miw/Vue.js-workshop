<template>
  <div>
    <h1>{{ name }}</h1>
    <v-btn color="success" @click="callMain()">callmain</v-btn>
  </div>
</template>

<script>
import {EventBus} from '@/EventBus'
export default {
  props: ["name"],
  methods: {
    callMain() {
        EventBus.$emit('CallAlertMain')
    }
  }
};
</script>

<style></style>
