<template>
  <div class="flex flex-col">
    <TheHeader></TheHeader>
    <div class="flex flex-row">
      <TheSidebar></TheSidebar>

      <div class="bg-gray-900 flex-grow">
        <!-- <ToastList></ToastList> -->
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ComputedRef, computed } from 'vue'
import TheSidebar from '@/components/TheSidebar.vue'
import TheHeader from '@/components/TheHeader.vue'
import ToastList from '@/components/shared/ToastList.vue'
import { useLoadingStore } from './store'

const loadingStore = useLoadingStore()

const isLoading: ComputedRef<boolean> = computed(() => loadingStore.isLoading)
</script>

<style scoped>
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
  background-color: var(--bs-gray);
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
