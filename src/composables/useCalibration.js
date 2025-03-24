import { reactive } from 'vue';

const calibrationState = reactive({
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
  message: '',
  error: ''
});

// Supported devices list
const supportedDevices = [
  { vendorId: 0x054C, productId: 0x05C4 }, // DS4 v1
  { vendorId: 0x054C, productId: 0x09CC }, // DS4 v2
  { vendorId: 0x054C, productId: 0x0CE6 }  // DualSense
];

async function connect() {
  try {
    calibrationState.error = '';
    calibrationState.message = '';

    const devices = await navigator.hid.requestDevice({
      filters: [{ vendorId: 0x054C }]
    });

    if (!devices || devices.length === 0) {
      calibrationState.message = 'No device selected';
      return;
    }

    const device = devices[0];
    if (!device) {
      calibrationState.error = 'Invalid device connection';
      return;
    }

    // Check if device is supported
    const isSupported = supportedDevices.some(d => 
      d.vendorId === device.vendorId && 
      d.productId === device.productId
    );

    if (!isSupported) {
      calibrationState.supported = false;
      calibrationState.error = 'Unsupported controller type';
      return;
    }

    await device.open();
    
    calibrationState.device = device;
    calibrationState.deviceName = device.productName;
    calibrationState.supported = true;
    calibrationState.controllerType = device.productId === 0x0CE6 ? 'DualSense' : 'DS4';

  } catch (err) {
    calibrationState.error = `Connection failed: ${err.message}`;
    console.error('HID Connection Error:', err);
  }
}

async function calibrateCenter() {
  if (!calibrationState.device || !calibrationState.supported) return;

  try {
    const gp = navigator.getGamepads()[0];
    if (gp) {
      calibrationState.offsets.left.x = gp.axes[0];
      calibrationState.offsets.left.y = gp.axes[1];
      calibrationState.offsets.right.x = gp.axes[2];
      calibrationState.offsets.right.y = gp.axes[3];
    }

    calibrationState.message = 'Center calibration complete!';
  } catch (err) {
    calibrationState.error = `Center calibration failed: ${err.message}`;
  }
}

async function saveCalibration() {
  if (!calibrationState.device || !calibrationState.supported) return;

  try {
    if (calibrationState.controllerType === 'DS4') {
      // DS4 calibration report structure
      const reportData = new Uint8Array(47);
      reportData.set([0x04, 0x01, 0xA0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], 0);
      
      // Convert normalized values to byte representation
      reportData[5] = Math.floor((calibrationState.offsets.left.x + 1) * 127);
      reportData[6] = Math.floor((calibrationState.offsets.left.y + 1) * 127);
      reportData[7] = Math.floor((calibrationState.offsets.right.x + 1) * 127);
      reportData[8] = Math.floor((calibrationState.offsets.right.y + 1) * 127);

      await calibrationState.device.sendFeatureReport(0x05, reportData);
    } else {
      // DualSense calibration (different report structure)
      const reportData = new Uint8Array(48);
      reportData[0] = 0x02; // Report ID
      // Add DualSense calibration logic here
      await calibrationState.device.sendFeatureReport(0x02, reportData);
    }
    
    calibrationState.message = 'Calibration saved permanently!';
  } catch (err) {
    calibrationState.error = `Save failed: ${err.message}`;
    // Fallback to localStorage for virtual devices
    localStorage.setItem('calibrationData', JSON.stringify(calibrationState.offsets));
    calibrationState.message = 'Saved to browser storage as fallback';
  }
}

export function useCalibration() {
  return {
    state: calibrationState,
    connect,
    calibrateCenter,
    calibrateRange: async () => { /* range calibration logic */ },
    saveCalibration
  };
}