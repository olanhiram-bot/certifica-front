<template>
  <div class="sup-loader">
    <div class="text-center">
      <div class="spinner-border" role="status" style="width:3rem; height:3rem; color:var(--color_primario)">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3 fs-5">{{ props.msg }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  msg: string
}>()
</script>

<style scoped>
.sup-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
