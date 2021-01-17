<template>
  <div class="flex-column">
    <h2>{{ account.name }}</h2>
    <DataTable :value="transactions" class="p-datatable-sm">
      <Column field="date" header="Date">
        <template #body="accountProps">
            <span>{{ formatDate(accountProps.data.date) }}</span>
        </template>
      </Column>
      <Column field="to" header="To"></Column>
      <Column field="categoryId" header="Category"></Column>
      <Column field="cost" header="Cost">
        <template #body="accountProps">
            <span class="flex-justify-content-end">{{ formatCurrency(accountProps.data.cost) }}</span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import AccountDataService from '../services/AccountDataService'
import TransactionDataService from '../services/TransactionDataService'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

export default {
  name: 'Account',
  components: {
    DataTable,
    Column
  },
  data() {
    return {
      account: AccountDataService.getAccount(this.$route.params.account),
      transactions: []
    }
  },
  beforeMount() {
    this.transactions = TransactionDataService.get(this.account.id);
  },
  methods: {
    formatDate(value) {
      if(!value) return;
      return `${value.getMonth()+1}/${value.getDate()}/${value.getFullYear()}`;
    },
    formatCurrency(value) {
      if(!value) return '';
      return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    }
  },
  watch: {
    $route() {
      this.account = AccountDataService.getAccount(this.$route.params.account);
      this.transactions = TransactionDataService.get(this.account.id);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.flex-justify-content-end {
  display: flex;
  justify-content: flex-end;
}
</style>
