<template>
  <div class="flex flex-col bg-gray-900 border-gray-100 w-52">
    <button
      type="button"
      @click="showAddAccountDialog()"
      class="inline-flex items-center justify-left rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
    >
      <i class="bi bi-plus-lg mr-2"></i>
      Account
    </button>

    <div class="border-t-2 border-gray-900 my-1"></div>

    <router-link
      v-for="account in accounts"
      :key="account.id"
      :to="{ name: 'Account', params: { url: account.url } }"
      class="items-center justify-left rounded-md truncate p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
      :title="account.name"
      >{{ account.name }}</router-link
    >
  </div>

  <AccountDialog ref="accountDialog" />
</template>

<script setup lang="ts">
import { type ComputedRef, computed, ref, onMounted } from 'vue'
import AccountDialog from './account/AccountDialog.vue'
import type { Account } from '@/models'
import { useAccountStore } from '@/store'

const accountStore = useAccountStore()

const accountDialog = ref()

const accounts: ComputedRef<Array<Account>> = computed(() => accountStore.all)

function showAddAccountDialog() {
  if (accountDialog.value) {
    accountDialog.value.open()
  }
}

onMounted(() => {
  accountStore.get()
})
</script>

<style scoped>
/* .sidebar-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 15em;
}

.sidebar {
  height: 100%;
  background-color: #1b1b1b;
  padding: 1em 0;
  border-right: 1px solid #262b30;
}

.sidebar-item {
  font-size: 18px;
  padding: 0.5em 1em;
  text-decoration: none;
  color: white;
}
.sidebar-item:hover {
  background-color: #454d55;
}

.sidebar-section {
  margin-top: 2em;
}

.sidebar-section-header {
  color: rgba(245, 245, 245, 0.8);
  font-size: 1.5em;
} */
</style>
