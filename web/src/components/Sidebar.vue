<template>
  <div class="flex-column sidebar">
    <router-link to="/" class="sidebar-item">Budget</router-link>
    <router-link to="/accounts/" class="sidebar-item">All Accounts</router-link>
    <div class="sidebar-section flex-column">
      <h4 class="sidebar-section-header">Accounts</h4>
      <router-link v-for="account in accounts"
        :key="account.id"
        :to="{ name: 'Account', params: { url: account.url }}"
        class="sidebar-item">{{ account.name }}</router-link>
    </div>
    <router-link to="/recipients" class="sidebar-item mt-auto">Recipients</router-link>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex'

export default {
  name: 'Sidebar',
  computed: {
    ...mapState({
      accounts: state => state.accounts.all
    })
  },
  created () {
    this.$store.dispatch('accounts/get')
  }
}
</script>

<style scoped>
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
    text-align: left;
    font-size: 1em;
  }
</style>
