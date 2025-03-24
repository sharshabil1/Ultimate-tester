<template>
  <div class="max-w-4xl mx-auto p-4 space-y-8">
    <!-- Sticks Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <StickTest 
        title="Left Stick"
        :x-value="controllerState.axes.lx"
        :y-value="controllerState.axes.ly"
      />
      <StickTest 
        title="Right Stick"
        :x-value="controllerState.axes.rx"
        :y-value="controllerState.axes.ry"
      />
    </div>

    <!-- Triggers Section -->
    <div class="bg-gray-800 p-6 rounded-lg">
      <h2 class="text-xl font-bold mb-4">Triggers</h2>
      <div class="grid grid-cols-2 gap-8">
        <TriggerBar 
          label="Left Trigger (L2)"
          :value="controllerState.axes.L2"
          color="bg-blue-500"
        />
        <TriggerBar 
          label="Right Trigger (R2)"
          :value="controllerState.axes.R2"
          color="bg-blue-500"
        />
      </div>
    </div>

    <!-- Buttons Grid -->
    <div class="bg-gray-800 p-6 rounded-lg">
      <h2 class="text-xl font-bold mb-4">Buttons</h2>
      <div class="grid grid-cols-4 md:grid-cols-6 gap-2">
        <ButtonIndicator
          v-for="(value, name) in controllerState.buttons"
          :key="name"
          :label="buttonLabels[name] || name"
          :pressed="value"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import StickTest from './StickVisualization.vue';
import TriggerBar from './TriggerBar.vue';
import ButtonIndicator from './ButtonIndicator.vue';

const props = defineProps({
  controllerState: {
    type: Object,
    required: true
  }
});

const buttonLabels = {
  cross: '✕',
  circle: '◯',
  square: '▢',
  triangle: '△',
  l1: 'L1',
  r1: 'R1',
  share: 'Share',
  options: 'Options',
  ps: 'PS',
  touchpad: 'Touch',
  l3: 'L3',
  r3: 'R3',
  dpadUp: 'Up',
  dpadDown: 'Down',
  dpadLeft: 'Left',
  dpadRight: 'Right'
};
</script>