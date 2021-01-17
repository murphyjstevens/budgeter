<template>
  <div class="flex-column">
    <div >
      <BudgetCategory 
        v-for="category in categories"
        :key="category.id"
        :category=category />
    </div>
  </div>
</template>

<script>
import BudgetCategory from './BudgetCategory.vue'

export default {
  name: 'Budget',
  data() {
    return { 
      categories: [{
        id: 1,
        name: 'Groceries',
        budget: 500.52,
        spent: 25.22
      },{
        id: 2,
        name: 'Mortage',
        budget: 2000.00,
        spent: 0.00
      }]
    }
  },
  components: {
    BudgetCategory
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
