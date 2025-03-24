<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
    <header class="py-4 border-b border-gray-700 text-center">
      <h1 class="text-3xl font-bold mb-2">Controller Tester</h1>
      <p class="text-sm text-gray-400">
        {{ deviceConnected ? `Connected: ${controllerState.info.label}` : 'No controller connected' }}
      </p>
      <p v-if="!deviceConnected" class="text-sm text-yellow-400 mt-2">
        Press a button on your controller to connect
      </p>
    </header>

    <nav class="flex justify-center mt-4 space-x-4">
      <button 
        @click="currentTab = 'tester'"
        :class="tabClass('tester')"
      >
        Tester
      </button>
      <button
        @click="currentTab = 'calibration'"
        :class="tabClass('calibration')"
      >
        Calibration
      </button>
    </nav>

    <main class="flex-1 p-4">
      <component :is="currentTabComponent" :controllerState="controllerState" />
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import TesterTab from './components/TesterTab.vue';
import CalibrationTab from './components/CalibrationTab.vue';

const currentTab = ref('tester');
const deviceConnected = ref(false);
const gamepadIndex = ref(null);

const controllerState = reactive({
  buttons: {
    cross: false, circle: false, square: false, triangle: false,
    l1: false, r1: false, share: false, options: false,
    ps: false, touchpad: false, l3: false, r3: false,
    dpadUp: false, dpadDown: false, dpadLeft: false, dpadRight: false
  },
  axes: {
    lx: 0, ly: 0, rx: 0, ry: 0,
    L2: 0, R2: 0
  },
  info: { label: '', key: '' }
});

const currentTabComponent = computed(() => {
  return currentTab.value === 'tester' ? TesterTab : CalibrationTab;
});

let rafId;
function updateGamepad() {
  const gamepads = navigator.getGamepads();
  
  // Check if we have an active gamepad
  let gp = null;
  
  // If we have a known index, try to use that first
  if (gamepadIndex.value !== null && gamepads[gamepadIndex.value]) {
    gp = gamepads[gamepadIndex.value];
  } else {
    // Otherwise, find the first connected gamepad
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        gp = gamepads[i];
        gamepadIndex.value = i;
        break;
      }
    }
  }
  
  if (gp) {
    deviceConnected.value = true;
    
    // Update buttons
    controllerState.buttons.cross = gp.buttons[0]?.pressed || false;
    controllerState.buttons.circle = gp.buttons[1]?.pressed || false;
    controllerState.buttons.square = gp.buttons[2]?.pressed || false;
    controllerState.buttons.triangle = gp.buttons[3]?.pressed || false;
    controllerState.buttons.l1 = gp.buttons[4]?.pressed || false;
    controllerState.buttons.r1 = gp.buttons[5]?.pressed || false;
    controllerState.buttons.share = gp.buttons[8]?.pressed || false;
    controllerState.buttons.options = gp.buttons[9]?.pressed || false;
    controllerState.buttons.l3 = gp.buttons[10]?.pressed || false;
    controllerState.buttons.r3 = gp.buttons[11]?.pressed || false;
    controllerState.buttons.ps = gp.buttons[12]?.pressed || false;
    controllerState.buttons.touchpad = gp.buttons[13]?.pressed || false;
    controllerState.buttons.dpadUp = gp.buttons[14]?.pressed || false;
    controllerState.buttons.dpadDown = gp.buttons[15]?.pressed || false;
    controllerState.buttons.dpadLeft = gp.buttons[16]?.pressed || false;
    controllerState.buttons.dpadRight = gp.buttons[17]?.pressed || false;

    // Update axes
    controllerState.axes.lx = gp.axes[0] || 0;
    controllerState.axes.ly = gp.axes[1] || 0;
    controllerState.axes.rx = gp.axes[2] || 0;
    controllerState.axes.ry = gp.axes[3] || 0;
    controllerState.axes.L2 = gp.buttons[6]?.value || 0;
    controllerState.axes.R2 = gp.buttons[7]?.value || 0;

    // Update device info
    if (!controllerState.info.label) {
      controllerState.info.label = gp.id;
      const vendorMatch = gp.id.match(/Vendor: (\w+)/);
      const productMatch = gp.id.match(/Product: (\w+)/);
      controllerState.info.key = `${vendorMatch?.[1] || '0000'}:${productMatch?.[1] || '0000'}`;
    }
  } else {
    // If no gamepad is found but we think one is connected, reset
    if (deviceConnected.value) {
      deviceConnected.value = false;
      gamepadIndex.value = null;
      controllerState.info.label = '';
      controllerState.info.key = '';
      resetControllerState();
    }
  }
  
  rafId = requestAnimationFrame(updateGamepad);
}

function resetControllerState() {
  // Reset all button states
  Object.keys(controllerState.buttons).forEach(key => {
    controllerState.buttons[key] = false;
  });
  
  // Reset all axes
  Object.keys(controllerState.axes).forEach(key => {
    controllerState.axes[key] = 0;
  });
}

function handleGamepadConnected(event) {
  console.log('Gamepad connected:', event.gamepad);
  gamepadIndex.value = event.gamepad.index;
  deviceConnected.value = true;
}

function handleGamepadDisconnected(event) {
  console.log('Gamepad disconnected:', event.gamepad);
  if (gamepadIndex.value === event.gamepad.index) {
    gamepadIndex.value = null;
    deviceConnected.value = false;
    controllerState.info.label = '';
    controllerState.info.key = '';
    resetControllerState();
  }
}

onMounted(() => {
  // Add event listeners for gamepad connection/disconnection
  window.addEventListener('gamepadconnected', handleGamepadConnected);
  window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);
  
  // Check if a gamepad is already connected
  const gamepads = navigator.getGamepads();
  for (let i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      gamepadIndex.value = i;
      deviceConnected.value = true;
      break;
    }
  }
  
  // Start the update loop
  rafId = requestAnimationFrame(updateGamepad);
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
  window.removeEventListener('gamepadconnected', handleGamepadConnected);
  window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
});

function tabClass(tab) {
  return [
    'px-4 py-2 rounded transition-colors',
    currentTab.value === tab 
      ? 'bg-blue-600 text-white' 
      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
  ].join(' ');
}
</script>