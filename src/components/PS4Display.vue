<template>
  <div class="tester p-4 bg-gray-800 rounded shadow">
    <h2 class="text-xl font-bold mb-2 text-center">Controller Visualization</h2>
    
    <!-- Render an image-like schematic of a controller -->
    <div class="relative mx-auto w-96 h-64 border border-gray-600 rounded bg-gray-900 overflow-hidden">
      <!-- Main body -->
      <div class="absolute w-80 h-32 bg-gray-800 rounded-full" style="left: 8%; top: 25%"></div>
      
      <!-- Left stick -->
      <div class="absolute w-24 h-24 rounded-full border border-gray-500"
           style="left: 15%; top: 30%;">
        <div class="absolute w-12 h-12 bg-gray-700 rounded-full"
             :style="{ 
               left: 'calc(50% - 24px)',
               top: 'calc(50% - 24px)',
               transform: `translate(${controllerState.axes.lx * 30}%, ${controllerState.axes.ly * 30}%)`
             }"
             :class="{'ring-2 ring-blue-500': controllerState.buttons.l3}"
        ></div>
      </div>
      
      <!-- Right stick -->
      <div class="absolute w-24 h-24 rounded-full border border-gray-500"
           style="right: 15%; top: 30%;">
        <div class="absolute w-12 h-12 bg-gray-700 rounded-full"
             :style="{ 
               left: 'calc(50% - 24px)',
               top: 'calc(50% - 24px)',
               transform: `translate(${controllerState.axes.rx * 30}%, ${controllerState.axes.ry * 30}%)`
             }"
             :class="{'ring-2 ring-blue-500': controllerState.buttons.r3}"
        ></div>
      </div>
      
      <!-- Trigger indicators -->
      <div class="absolute flex items-center space-x-1" style="left: 5%; top: 10%;">
        <div class="text-xs font-bold">L2</div>
        <div class="w-16 h-4 bg-gray-700 rounded overflow-hidden">
          <div class="h-full bg-blue-500 transition-all" 
               :style="{ width: (controllerState.axes.L2 * 100) + '%' }"></div>
        </div>
      </div>
      
      <div class="absolute flex items-center space-x-1" style="right: 5%; top: 10%;">
        <div class="text-xs font-bold">R2</div>
        <div class="w-16 h-4 bg-gray-700 rounded overflow-hidden">
          <div class="h-full bg-blue-500 transition-all" 
               :style="{ width: (controllerState.axes.R2 * 100) + '%' }"></div>
        </div>
      </div>
      
      <!-- Shoulder buttons -->
      <div class="absolute px-2 py-1 text-xs font-bold rounded transition-colors"
           :class="controllerState.buttons.l1 ? 'bg-blue-500' : 'bg-gray-700'"
           style="left: 10%; top: 15%">L1</div>
           
      <div class="absolute px-2 py-1 text-xs font-bold rounded transition-colors"
           :class="controllerState.buttons.r1 ? 'bg-blue-500' : 'bg-gray-700'"
           style="right: 10%; top: 15%">R1</div>
      
      <!-- D-pad -->
      <div class="absolute" style="left: 35%; top: 40%;">
        <div class="relative w-20 h-20">
          <div class="absolute w-6 h-6 rounded transition-colors"
               :class="controllerState.buttons.dpadUp ? 'bg-blue-500' : 'bg-gray-700'"
               style="left: 50%; top: 0; transform: translateX(-50%)">▲</div>
          <div class="absolute w-6 h-6 rounded transition-colors"
               :class="controllerState.buttons.dpadDown ? 'bg-blue-500' : 'bg-gray-700'"
               style="left: 50%; bottom: 0; transform: translateX(-50%)">▼</div>
          <div class="absolute w-6 h-6 rounded transition-colors"
               :class="controllerState.buttons.dpadLeft ? 'bg-blue-500' : 'bg-gray-700'"
               style="left: 0; top: 50%; transform: translateY(-50%)">◄</div>
          <div class="absolute w-6 h-6 rounded transition-colors"
               :class="controllerState.buttons.dpadRight ? 'bg-blue-500' : 'bg-gray-700'"
               style="right: 0; top: 50%; transform: translateY(-50%)">►</div>
        </div>
      </div>
      
      <!-- Face buttons -->
      <div class="absolute" style="right: 35%; top: 40%;">
        <div class="relative w-20 h-20">
          <div class="absolute w-8 h-8 rounded-full flex items-center justify-center transition-colors"
               :class="controllerState.buttons.triangle ? 'bg-green-500' : 'bg-gray-700'"
               style="left: 50%; top: 0; transform: translateX(-50%)">△</div>
          <div class="absolute w-8 h-8 rounded-full flex items-center justify-center transition-colors"
               :class="controllerState.buttons.cross ? 'bg-blue-500' : 'bg-gray-700'"
               style="left: 50%; bottom: 0; transform: translateX(-50%)">✕</div>
          <div class="absolute w-8 h-8 rounded-full flex items-center justify-center transition-colors"
               :class="controllerState.buttons.square ? 'bg-pink-500' : 'bg-gray-700'"
               style="left: 0; top: 50%; transform: translateY(-50%)">□</div>
          <div class="absolute w-8 h-8 rounded-full flex items-center justify-center transition-colors"
               :class="controllerState.buttons.circle ? 'bg-red-500' : 'bg-gray-700'"
               style="right: 0; top: 50%; transform: translateY(-50%)">○</div>
        </div>
      </div>
      
      <!-- Center buttons -->
      <div class="absolute flex space-x-2" style="left: 50%; top: 70%; transform: translateX(-50%)">
        <div class="px-2 py-1 text-xs font-bold rounded transition-colors"
             :class="controllerState.buttons.share ? 'bg-blue-500' : 'bg-gray-700'">
          SHARE
        </div>
        <div class="px-2 py-1 text-xs font-bold rounded-full transition-colors"
             :class="controllerState.buttons.ps ? 'bg-blue-500' : 'bg-gray-700'">
          PS
        </div>
        <div class="px-2 py-1 text-xs font-bold rounded transition-colors"
             :class="controllerState.buttons.options ? 'bg-blue-500' : 'bg-gray-700'">
          OPTIONS
        </div>
      </div>
      
      <!-- Touchpad -->
      <div class="absolute w-24 h-8 rounded transition-colors"
           :class="controllerState.buttons.touchpad ? 'bg-blue-500' : 'bg-gray-700'"
           style="left: 50%; top: 20%; transform: translateX(-50%)">
        <div class="text-xs text-center mt-1">TOUCHPAD</div>
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