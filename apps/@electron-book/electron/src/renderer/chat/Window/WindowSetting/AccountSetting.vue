<script setup lang="ts">
import { onMounted } from "vue";
import { dialogReady } from "../../common/Dialog";
onMounted(() => {
  window.addEventListener("message", (e) => {
    console.log(e.data);
  });
  dialogReady();
})
</script>
<template>
  <div>账号设置</div>
</template>
<style scoped lang="scss"></style>
