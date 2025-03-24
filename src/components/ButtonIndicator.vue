<template>
  <div
    class="p-2 text-center rounded transition-colors"
    :class="pressed ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'"
  >
    <div class="text-sm">{{ label }}</div>
    <div class="text-xs opacity-75">{{ pressed ? 'ON' : 'OFF' }}</div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  pressed: Boolean
});
</script>