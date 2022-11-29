<template>
  <div class="sidebar-wrapper flex-column sidebar">
    <router-link to="/" class="sidebar-item">Budget</router-link>
    <router-link to="/accounts/" class="sidebar-item">All Accounts</router-link>
    <div class="sidebar-section flex-column">
      <span class="flex-row mb-1 border-bottom border-top py-1">
        <h4 class="sidebar-section-header flex-grow-1 align-self-end mb-0 ms-2">
          Accounts
        </h4>
        <button
          type="button"
          @click="showAddAccountDialog()"
          class="btn btn-outline-primary btn-sm me-2"
        >
          <i class="bi bi-plus-lg"></i>
        </button>
      </span>
      <router-link
        v-for="account in accounts"
        :key="account.id"
        :to="{ name: 'Account', params: { url: account.url } }"
        class="sidebar-item"
        >{{ account.name }}</router-link
      >
    </div>
    <router-link to="/recipients" class="sidebar-item mt-auto"
      >Recipients</router-link
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
.sidebar-wrapper {
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
}
</style>
