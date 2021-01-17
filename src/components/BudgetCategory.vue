<template>
  <div class="flex-row budget-category-row">
    <div class="flex-grow">{{ category.name }}</div>
    <input :value="category.budget" type="number" step="0.01" class="text-align-right small-margin-left">
    <input :value="category.spent" type="number" step="0.01" class="text-align-right small-margin-left">
    <input :value="available" type="number" step="0.01" class="text-align-right small-margin-left" readonly>
  </div>
</template>

<script>
export default {
  name: 'Budget',
  props: ['category'],
  computed: {
    available: {
      get() {
        return parseFloat(this.category.budget - this.category.spent).toFixed(2);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.budget-category-row {
  background: whitesmoke;
  padding: 0.5em;
  border-bottom: 1px solid white;
}

.small-margin-left {
  margin-left: 1em;
}
</style>
