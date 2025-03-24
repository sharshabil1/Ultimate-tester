<template>
  <div class="p-4 bg-gray-800 rounded shadow">
    <h2 class="text-xl font-bold mb-2">Generic Controller</h2>
    <div class="text-sm">
      <pre>{{ controller }}</pre>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  controller: Object
});
</script>

<style scoped>
</style>
