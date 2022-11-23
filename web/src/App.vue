<template>
  <TheSidebar class="sidebar-wrapper"></TheSidebar>

  <div class="content-wrapper">
    <ToastList></ToastList>
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-dialog flex-column">
        <div class="spinner-border" role="status"></div>
        <h4 class="mt-3">Loading...</h4>
      </div>
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ComputedRef, computed, watch } from 'vue'
import TheSidebar from '@/components/TheSidebar.vue'
import ToastList from '@/components/shared/ToastList.vue'
import { useLoadingStore } from './store'

const loadingStore = useLoadingStore()

const isLoading: ComputedRef<boolean> = computed(() => loadingStore.isLoading)

watch(isLoading, (value) => console.log(value))
</script>

<style scoped>
.sidebar-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 15em;
}

.content-wrapper {
  margin-left: 15em;
}

.content {
  padding: 5em;
}

.loading-overlay {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  align-items: center;
}

.loading-dialog {
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  border-radius: 10px;
  background-color: white;
  width: 300px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px;
  margin-top: 190px;
}

.loading-message {
  margin-top: 0.5em;
}
</style>
