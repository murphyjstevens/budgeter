<template>
  <input
    class="bg-slate-600 text-white rounded-md px-3 py-1"
    @onfocus="onFocus($event)"
  />
</template>

<script setup lang="ts">
function onFocus(el: any) {
  el.select()
}
</script>
