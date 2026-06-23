<template>
  <LoadingScreen v-if="loadingActive" :msg="loadingMsg" />
  <router-view />
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue'
import { useLoadingStore } from './stores/loading'

const LoadingScreen = defineAsyncComponent(() => import('@/components/LoadingScreen.vue'))

const loadingStore = useLoadingStore()

const loadingActive = computed(() => loadingStore.active)
const loadingMsg = computed(() => loadingStore.msg)
</script>