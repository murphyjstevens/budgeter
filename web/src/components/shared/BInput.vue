<template>
  <input
    class="bg-slate-600 text-white rounded-sm"
    @onfocus="onFocus($event)"
  />
</template>

<script setup lang="ts">
function onFocus(el: any) {
  el.select()
}
</script>
