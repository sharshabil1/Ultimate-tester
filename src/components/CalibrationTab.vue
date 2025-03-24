<template>
  <div class="max-w-4xl mx-auto p-4 space-y-8">
    <!-- Circularity Test Section -->
    <div class="bg-gray-800 p-6 rounded-lg">
      <h2 class="text-xl font-bold mb-4">Stick Circularity Test</h2>
      <p class="text-gray-300 mb-4">
        Move each stick in a full circular motion to test accuracy and deadzone.
        Enable the "Test Circularity" checkbox to see error measurements.
      </p>
      
      <!-- Instructions Panel -->
      <div class="bg-gray-700 p-4 rounded-lg mb-6">
        <h3 class="font-medium mb-2">Instructions:</h3>
        <ol class="list-decimal list-inside space-y-2 text-gray-300">
          <li>Check "Test Circularity" to enable the test</li>
          <li>Move the stick in a full circular motion along the outer edge</li>
          <li>Green lines indicate good accuracy, red lines show high deviation</li>
          <li>Lower error percentages indicate better circularity</li>
        </ol>
      </div>
      
      <!-- Circularity Results -->
      <div v-if="testActive" class="bg-gray-700 p-4 rounded-lg mb-4">
        <h3 class="font-medium mb-2">Diagnostics:</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="text-center">
            <div class="inline-block px-4 py-2 bg-gray-800 rounded">
              Left Stick Avg Error: 
              <span :class="getErrorClass(leftStickError)">
                {{ (leftStickError * 100).toFixed(1) }}%
              </span>
            </div>
          </div>
          <div class="text-center">
            <div class="inline-block px-4 py-2 bg-gray-800 rounded">
              Right Stick Avg Error: 
              <span :class="getErrorClass(rightStickError)">
                {{ (rightStickError * 100).toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Calibration Sticks -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-gray-700 p-4 rounded-lg">
          <StickVisualization 
            title="Left Stick Test"
            :x-value="controllerState.axes.lx"
            :y-value="controllerState.axes.ly"
            :size="240"
            :deadzone="getDeadzone('left')"
            stick-type="left"
            ref="leftStickRef"
            @update:circularity-test="handleCircularityTestUpdate"
          />
          <div class="mt-4 text-sm">
            <p>Deadzone: <span v-if="getDeadzone('left') > 0">{{ (getDeadzone('left') * 100).toFixed(1) }}%</span><span v-else>Not detected</span></p>
            <p>Raw Values: X {{ rawValues.left.x.toFixed(4) }} Y {{ rawValues.left.y.toFixed(4) }}</p>
          </div>
        </div>
        
        <div class="bg-gray-700 p-4 rounded-lg">
          <StickVisualization 
            title="Right Stick Test"
            :x-value="controllerState.axes.rx"
            :y-value="controllerState.axes.ry"
            :size="240"
            :deadzone="getDeadzone('right')"
            stick-type="right"
            ref="rightStickRef"
            @update:circularity-test="handleCircularityTestUpdate"
          />
          <div class="mt-4 text-sm">
            <p>Deadzone: <span v-if="getDeadzone('right') > 0">{{ (getDeadzone('right') * 100).toFixed(1) }}%</span><span v-else>Not detected</span></p>
            <p>Raw Values: X {{ rawValues.right.x.toFixed(4) }} Y {{ rawValues.right.y.toFixed(4) }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Center Calibration -->
    <div class="bg-gray-800 p-6 rounded-lg">
      <h2 class="text-xl font-bold mb-4">Center Calibration</h2>
      <p class="text-gray-300 mb-4">Release both sticks and press the button below to set the center position.</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-gray-700 p-4 rounded-lg">
          <h3 class="font-medium mb-2">Left Stick Center Offset</h3>
          <div class="grid grid-cols-2 gap-2 mb-4">
            <div>
              <p class="text-sm">X Offset: {{ calibrationData.offsets.left.x.toFixed(4) }}</p>
            </div>
            <div>
              <p class="text-sm">Y Offset: {{ calibrationData.offsets.left.y.toFixed(4) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-700 p-4 rounded-lg">
          <h3 class="font-medium mb-2">Right Stick Center Offset</h3>
          <div class="grid grid-cols-2 gap-2 mb-4">
            <div>
              <p class="text-sm">X Offset: {{ calibrationData.offsets.right.x.toFixed(4) }}</p>
            </div>
            <div>
              <p class="text-sm">Y Offset: {{ calibrationData.offsets.right.y.toFixed(4) }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-4">
        <button 
          @click="calibrateCenter"
          class="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
        >
          Calibrate Center Position
        </button>
      </div>
    </div>
    
    <!-- Range Calibration -->
    <div class="bg-gray-800 p-6 rounded-lg">
      <h2 class="text-xl font-bold mb-4">Range Calibration</h2>
      <p class="text-gray-300 mb-4">Move both sticks to their full extent in a circular motion, then press Save.</p>
      
      <div v-if="rangeCalibrationActive" class="bg-gray-700 p-4 rounded-lg mb-4">
        <h3 class="font-medium mb-2">Recording Range...</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm mb-1">Left Stick Min/Max:</p>
            <p class="text-xs">X: {{ calibrationData.ranges.left.minX.toFixed(2) }} to {{ calibrationData.ranges.left.maxX.toFixed(2) }}</p>
            <p class="text-xs">Y: {{ calibrationData.ranges.left.minY.toFixed(2) }} to {{ calibrationData.ranges.left.maxY.toFixed(2) }}</p>
          </div>
          <div>
            <p class="text-sm mb-1">Right Stick Min/Max:</p>
            <p class="text-xs">X: {{ calibrationData.ranges.right.minX.toFixed(2) }} to {{ calibrationData.ranges.right.maxX.toFixed(2) }}</p>
            <p class="text-xs">Y: {{ calibrationData.ranges.right.minY.toFixed(2) }} to {{ calibrationData.ranges.right.maxY.toFixed(2) }}</p>
          </div>
        </div>
      </div>
      
      <div class="flex space-x-4">
        <button 
          @click="toggleRangeCalibration"
          class="px-4 py-2 rounded transition-colors"
          :class="rangeCalibrationActive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'"
        >
          {{ rangeCalibrationActive ? 'Stop Recording' : 'Start Range Calibration' }}
        </button>
        <button 
          @click="resetRangeCalibration"
          class="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
        >
          Reset Range
        </button>
      </div>
    </div>
    
    <!-- HID Calibration Controls -->
    <div class="bg-gray-800 p-6 rounded-lg">
      <h2 class="text-xl font-bold mb-4">HID Calibration</h2>
      <p class="text-gray-300 mb-4">
        Use HID API to permanently save calibration to supported controllers.
      </p>
      
      <div v-if="calibrationData.error" class="mb-4 p-3 bg-red-900 text-white rounded">
        {{ calibrationData.error }}
      </div>
      
      <div v-if="calibrationData.message" class="mb-4 p-3 bg-green-900 text-white rounded">
        {{ calibrationData.message }}
      </div>
      
      <div class="mb-4">
        <div class="flex items-center">
          <p class="text-gray-300">
            Device: 
            <span class="font-medium" v-if="calibrationData.deviceName">
              {{ calibrationData.deviceName }}
              <span class="text-green-400" v-if="calibrationData.supported">(Supported)</span>
              <span class="text-red-400" v-else>(Unsupported)</span>
            </span>
            <span v-else>Not connected</span>
          </p>
        </div>
      </div>
      
      <div class="flex space-x-4">
        <button 
          @click="connectHID"
          class="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
        >
          Connect HID Device
        </button>
        <button
          @click="saveCalibrationToDevice"
          class="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors"
          :disabled="!calibrationData.device || !calibrationData.supported"
          :class="{'opacity-50 cursor-not-allowed': !calibrationData.device || !calibrationData.supported}"
        >
          Save to Device
        </button>
        <button
          class="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          @click="exportResults"
        >
          Export Calibration
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import StickVisualization from './StickVisualization.vue';

const props = defineProps({
  controllerState: {
    type: Object,
    required: true
  }
});

const leftStickRef = ref(null);
const rightStickRef = ref(null);
const testActive = ref(false);
const leftStickError = ref(0);
const rightStickError = ref(0);
const rangeCalibrationActive = ref(false);
const calibrationInterval = ref(null);

// Raw stick values before any calibration
const rawValues = reactive({
  left: { x: 0, y: 0 },
  right: { x: 0, y: 0 }
});

// Update raw values when controller state changes
watch(() => props.controllerState.axes, (newAxes) => {
  rawValues.left.x = newAxes.lx;
  rawValues.left.y = newAxes.ly;
  rawValues.right.x = newAxes.rx;
  rawValues.right.y = newAxes.ry;
}, { immediate: true, deep: true });

// Calibration data
const calibrationData = reactive({
  device: null,
  deviceName: '',
  supported: false,
  controllerType: '', // 'DS4' or 'DualSense'
  offsets: {
    left: { x: 0, y: 0 },
    right: { x: 0, y: 0 }
  },
  ranges: {
    left: { minX: -1, maxX: 1, minY: -1, maxY: 1 },
    right: { minX: -1, maxX: 1, minY: -1, maxY: 1 }
  },
  deadzones: {
    left: 0.05,
    right: 0.05
  },
  message: '',
  error: ''
});

// Supported devices list (for HID API)
const supportedDevices = [
  { vendorId: 0x054C, productId: 0x05C4, name: 'Sony DualShock 4 v1' },
  { vendorId: 0x054C, productId: 0x09CC, name: 'Sony DualShock 4 v2' },
  { vendorId: 0x054C, productId: 0x0CE6, name: 'Sony DualSense' }
];

// Calculate deadzone based on stored value
function getDeadzone(stick) {
  return calibrationData.deadzones[stick];
}

// Connect to HID device
async function connectHID() {
  try {
    calibrationData.error = '';
    calibrationData.message = '';

    // Check if HID API is available
    if (!navigator.hid) {
      calibrationData.error = 'WebHID API not available in this browser';
      return;
    }

    const devices = await navigator.hid.requestDevice({
      filters: [{ vendorId: 0x054C }] // Sony vendor ID
    });

    if (!devices || devices.length === 0) {
      calibrationData.message = 'No device selected';
      return;
    }

    const device = devices[0];
    if (!device) {
      calibrationData.error = 'Invalid device connection';
      return;
    }

    // Check if device is supported
    const supportedDevice = supportedDevices.find(d => 
      d.vendorId === device.vendorId && 
      d.productId === device.productId
    );

    if (!supportedDevice) {
      calibrationData.supported = false;
      calibrationData.error = 'Unsupported controller type';
      calibrationData.deviceName = device.productName || 'Unknown Device';
      return;
    }

    await device.open();
    
    calibrationData.device = device;
    calibrationData.deviceName = supportedDevice.name || device.productName;
    calibrationData.supported = true;
    calibrationData.controllerType = device.productId === 0x0CE6 ? 'DualSense' : 'DS4';
    calibrationData.message = 'Device connected successfully!';

  } catch (err) {
    calibrationData.error = `Connection failed: ${err.message}`;
    console.error('HID Connection Error:', err);
  }
}

// Calibrate center position
function calibrateCenter() {
  try {
    calibrationData.offsets.left.x = props.controllerState.axes.lx;
    calibrationData.offsets.left.y = props.controllerState.axes.ly;
    calibrationData.offsets.right.x = props.controllerState.axes.rx;
    calibrationData.offsets.right.y = props.controllerState.axes.ry;
    
    calibrationData.message = 'Center calibration complete!';
    
    // Save to localStorage as backup
    localStorage.setItem('controllerCalibration', JSON.stringify({
      offsets: calibrationData.offsets,
      ranges: calibrationData.ranges,
      deadzones: calibrationData.deadzones
    }));
  } catch (err) {
    calibrationData.error = `Center calibration failed: ${err.message}`;
  }
}

// Toggle range calibration recording
function toggleRangeCalibration() {
  if (rangeCalibrationActive.value) {
    // Stop recording
    if (calibrationInterval.value) {
      clearInterval(calibrationInterval.value);
      calibrationInterval.value = null;
    }
    rangeCalibrationActive.value = false;
    calibrationData.message = 'Range calibration completed!';
    
    // Save to localStorage as backup
    localStorage.setItem('controllerCalibration', JSON.stringify({
      offsets: calibrationData.offsets,
      ranges: calibrationData.ranges,
      deadzones: calibrationData.deadzones
    }));
  } else {
    // Start recording
    resetRangeCalibration();
    rangeCalibrationActive.value = true;
    
    // Start interval to record min/max values
    calibrationInterval.value = setInterval(() => {
      // Adjust for the center offset
      const leftX = props.controllerState.axes.lx;
      const leftY = props.controllerState.axes.ly;
      const rightX = props.controllerState.axes.rx;
      const rightY = props.controllerState.axes.ry;
      
      // Update left stick ranges
      calibrationData.ranges.left.minX = Math.min(calibrationData.ranges.left.minX, leftX);
      calibrationData.ranges.left.maxX = Math.max(calibrationData.ranges.left.maxX, leftX);
      calibrationData.ranges.left.minY = Math.min(calibrationData.ranges.left.minY, leftY);
      calibrationData.ranges.left.maxY = Math.max(calibrationData.ranges.left.maxY, leftY);
      
      // Update right stick ranges
      calibrationData.ranges.right.minX = Math.min(calibrationData.ranges.right.minX, rightX);
      calibrationData.ranges.right.maxX = Math.max(calibrationData.ranges.right.maxX, rightX);
      calibrationData.ranges.right.minY = Math.min(calibrationData.ranges.right.minY, rightY);
      calibrationData.ranges.right.maxY = Math.max(calibrationData.ranges.right.maxY, rightY);
    }, 100);
  }
}

// Reset range calibration
function resetRangeCalibration() {
  calibrationData.ranges = {
    left: { minX: 0, maxX: 0, minY: 0, maxY: 0 },
    right: { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  };
}

// Save calibration to device
async function saveCalibrationToDevice() {
  if (!calibrationData.device || !calibrationData.supported) {
    calibrationData.error = 'No supported device connected';
    return;
  }

  try {
    if (calibrationData.controllerType === 'DS4') {
      // DS4 calibration report structure
      const reportData = new Uint8Array(47);
      reportData.set([0x04, 0x01, 0xA0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], 0);
      
      // Convert normalized values to byte representation
      reportData[5] = Math.floor((calibrationData.offsets.left.x + 1) * 127);
      reportData[6] = Math.floor((calibrationData.offsets.left.y + 1) * 127);
      reportData[7] = Math.floor((calibrationData.offsets.right.x + 1) * 127);
      reportData[8] = Math.floor((calibrationData.offsets.right.y + 1) * 127);
      
      // Send the report
      await calibrationData.device.sendReport(0x01, reportData);
      calibrationData.message = 'Calibration saved to controller!';
    
    } else if (calibrationData.controllerType === 'DualSense') {
      // DualSense calibration report - structure differs from DS4
      const reportData = new Uint8Array(48);
      reportData.set([0x05, 0x02, 0xB0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], 0);
      
      // Convert normalized values to byte representation
      reportData[5] = Math.floor((calibrationData.offsets.left.x + 1) * 127);
      reportData[6] = Math.floor((calibrationData.offsets.left.y + 1) * 127);
      reportData[7] = Math.floor((calibrationData.offsets.right.x + 1) * 127);
      reportData[8] = Math.floor((calibrationData.offsets.right.y + 1) * 127);
      
      // Send the report
      await calibrationData.device.sendReport(0x02, reportData);
      calibrationData.message = 'Calibration saved to controller!';
    }
  } catch (err) {
    calibrationData.error = `Save failed: ${err.message}`;
    console.error('Save Calibration Error:', err);
  }
}

// Export calibration results as a JSON file
function exportResults() {
  try {
    const data = {
      deviceName: calibrationData.deviceName,
      offsets: calibrationData.offsets,
      ranges: calibrationData.ranges,
      deadzones: calibrationData.deadzones
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'controller-calibration.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    calibrationData.message = 'Calibration data exported!';
  } catch (err) {
    calibrationData.error = `Export failed: ${err.message}`;
  }
}

// Get CSS class for error display
function getErrorClass(error) {
  if (error < 0.05) return 'text-green-400';
  if (error < 0.1) return 'text-yellow-400';
  return 'text-red-400';
}

// Handle circularity test update
function handleCircularityTestUpdate(event) {
  const { stickType, isActive, error } = event;
  testActive.value = isActive;
  
  if (stickType === 'left') {
    leftStickError.value = error;
  } else if (stickType === 'right') {
    rightStickError.value = error;
  }
}

// Load saved calibration data if available
onMounted(() => {
  try {
    const savedData = localStorage.getItem('controllerCalibration');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      
      if (parsedData.offsets) {
        calibrationData.offsets = parsedData.offsets;
      }
      
      if (parsedData.ranges) {
        calibrationData.ranges = parsedData.ranges;
      }
      
      if (parsedData.deadzones) {
        calibrationData.deadzones = parsedData.deadzones;
      }
    }
  } catch (err) {
    console.error('Failed to load saved calibration:', err);
  }
});
</script>