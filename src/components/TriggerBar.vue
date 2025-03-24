<template>
  <div>
    <h3 class="text-lg mb-2">{{ label }}</h3>
    <div class="h-24 bg-gray-700 rounded relative overflow-hidden">
      <div 
        class="absolute bottom-0 w-full transition-all duration-100"
        :class="color"
        :style="{ height: `${value * 100}%` }"
      ></div>
    </div>
    <div class="mt-2 text-center text-sm text-gray-300">
      {{ (value * 100).toFixed(0) }}%
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: 'bg-blue-500'
  }
});
</script>