<template>
  <div class="tester p-4 bg-gray-800 rounded shadow">
    <h2 class="text-xl font-bold mb-2 text-center">PS5 Controller Tester</h2>
    <div class="relative mx-auto w-80 h-80 border border-gray-600 rounded">
      <!-- Left stick -->
      <div class="absolute w-24 h-24 rounded-full border border-gray-500"
           style="left: 10%; top: 60%;">
        <div class="absolute w-4 h-4 bg-white rounded-full"
             :style="{ left: ((controllerState.axes.lx + 1)/2*100) + '%', top: ((controllerState.axes.ly + 1)/2*100) + '%' }">
        </div>
      </div>
      <!-- Right stick -->
      <div class="absolute w-24 h-24 rounded-full border border-gray-500"
           style="right: 10%; top: 60%;">
        <div class="absolute w-4 h-4 bg-white rounded-full"
             :style="{ left: ((controllerState.axes.rx + 1)/2*100) + '%', top: ((controllerState.axes.ry + 1)/2*100) + '%' }">
        </div>
      </div>
      <!-- Trigger bars -->
      <div class="absolute w-4 h-20 bg-gray-700 rounded" style="left: 5%; top: 20%;">
        <div class="bg-orange-500 w-full" :style="{ height: (controllerState.axes.L2 * 100) + '%' }"></div>
      </div>
      <div class="absolute w-4 h-20 bg-gray-700 rounded" style="right: 5%; top: 20%;">
        <div class="bg-orange-500 w-full" :style="{ height: (controllerState.axes.R2 * 100) + '%' }"></div>
      </div>
      <!-- Face buttons -->
      <div class="absolute" style="right: 15%; top: 50%;">
        <div class="w-8 h-8 rounded-full"
             :class="{'bg-red-500 shadow-lg': controllerState.buttons.circle, 'bg-gray-600': !controllerState.buttons.circle}">
          <span class="text-sm font-bold text-white">◯</span>
        </div>
        <div class="mt-2 w-8 h-8 rounded-full"
             :class="{'bg-green-500 shadow-lg': controllerState.buttons.triangle, 'bg-gray-600': !controllerState.buttons.triangle}">
          <span class="text-sm font-bold text-white">△</span>
        </div>
      </div>
      <div class="absolute" style="right: 5%; top: 60%;">
        <div class="w-8 h-8 rounded-full"
             :class="{'bg-purple-500 shadow-lg': controllerState.buttons.square, 'bg-gray-600': !controllerState.buttons.square}">
          <span class="text-sm font-bold text-white">□</span>
        </div>
        <div class="mt-2 w-8 h-8 rounded-full"
             :class="{'bg-blue-500 shadow-lg': controllerState.buttons.cross, 'bg-gray-600': !controllerState.buttons.cross}">
          <span class="text-sm font-bold text-white">✕</span>
        </div>
      </div>
      <!-- Battery and Mic Info -->
      <div class="absolute top-4 left-1/2 transform -translate-x-1/2 text-sm">
        <p>Battery: {{ controllerState.battery.level }}%</p>
        <p>Mic: {{ controllerState.buttons.mic ? 'On' : 'Muted' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  controllerState: Object
});
</script>

<style scoped>
.tester {
  transition: all 0.1s ease-in-out;
}
</style>
