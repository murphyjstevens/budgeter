<template>
  <div class="sidebar">
    <router-link to="/" class="sidebar-item">Budget</router-link>
    <router-link to="/accounts/all" class="sidebar-item">All Accounts</router-link>
    <div class="sidebar-section">
      <h4 class="sidebar-section-header">Accounts</h4>
      <router-link v-for="account in accounts"
        v-bind:key="account.id" 
        :to="`/accounts/${account.url}`"
        class="sidebar-item">{{ account.name }}</router-link>
    </div>
  </div>
</template>

<script>
import AccountDataService from '../services/AccountDataService'

export default {
  name: 'Sidebar',
  data() {
    return {
      accounts: AccountDataService.getAccounts()
    }
  }
}
</script>

<style scoped>
  .sidebar {
    display: flex;
    flex-direction: column;
    background-color: #4f1244;
    padding: 1em 0;
  }
  .sidebar-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 18px;
    padding: 0.5em 1em;
    text-decoration: none;
    color: white;
  }
  .sidebar-item:hover {
    background-color: #300b29;
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