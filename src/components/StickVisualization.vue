<template>
  <div class="stick-visualization">
    <div class="controls">
      <label>
        <input type="checkbox" v-model="testCircularity" />
        Test Circularity
      </label>
      <button @click="clearPath">Clear Path</button>
    </div>

    <div class="visualization-container">
      <canvas
        ref="stickCanvas"
        :width="canvasSize"
        :height="canvasSize"
        class="stick-canvas"
      ></canvas>

      <div class="stats" v-if="testCircularity">
        <p><strong>Avg Error:</strong> {{ avgError.toFixed(2) }}%</p>
        <p><strong>Max Error:</strong> {{ maxError.toFixed(2) }}%</p>
        <p><strong>Samples:</strong> {{ samplesCount }}</p>
      </div>
    </div>
  </div>
</template>

<script>
const SEGMENTS = 48;
const IDEAL_RADIUS = 1.0;
export default {
  name: "StickVisualization",
  props: {
    xValue: Number,
    yValue: Number,
    canvasSize: {
      type: Number,
      default: 240
    }
  },
  data() {
    return {
      testCircularity: false,
      pathSegments: new Array(SEGMENTS).fill(0),
      deadZoneThreshold: 0.05,
      samplesCount: 0
    };
  },
  computed: {
    avgError() {
      const validSegments = this.pathSegments.filter(d => d > 0.2);
      if (validSegments.length === 0) return 0;
      const totalError = validSegments.reduce((sum, d) => 
        sum + Math.pow(d - IDEAL_RADIUS, 2), 0);
      return Math.sqrt(totalError / validSegments.length) * 100;
    },
    maxError() {
      return Math.max(...this.pathSegments.map(d => 
        Math.abs(d - IDEAL_RADIUS) * 100)) || 0;
    }
  },
  watch: {
    xValue() { this.handleStickMovement(); },
    yValue() { this.handleStickMovement(); },
    testCircularity(newVal) {
      if (!newVal) this.clearPath();
    }
  },
  mounted() {
    this.drawCanvas();
  },
  methods: {
    clearPath() {
      this.pathSegments.fill(0);
      this.samplesCount = 0;
      this.drawCanvas();
    },
    // Hue coloring helper function (similar to your original logic)
    cc_to_color(cc) {
      const dd = Math.sqrt(Math.pow(1.0 - cc, 2));
      let hh;
      if (cc <= 1.0) {
        hh = 220 - 220 * Math.min(1.0, Math.max(0, (dd - 0.05)) / 0.1);
      } else {
        hh = (245 + (360 - 245) * Math.min(1.0, Math.max(0, (dd - 0.05)) / 0.15)) % 360;
      }
      return hh;
    },
    handleStickMovement() {
      const x = this.xValue;
      const y = this.yValue;
      const magnitude = Math.hypot(x, y);

      if (magnitude < this.deadZoneThreshold) {
        this.drawCanvas(0, 0);
        return;
      }

      this.drawCanvas(x, y);

      if (this.testCircularity) {
        const angle = Math.atan2(y, x);
        const segment = Math.round((angle + Math.PI) * SEGMENTS / (2 * Math.PI)) % SEGMENTS;
        this.pathSegments[segment] = Math.max(this.pathSegments[segment], magnitude);
        this.samplesCount++;
      }
    },
    drawCanvas(xPos = 0, yPos = 0) {
      const canvas = this.$refs.stickCanvas;
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d");
      const center = canvas.width / 2;
      const radius = center - 10;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw reference circle
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw circularity visualization with hue coloring if enabled
      if (this.testCircularity) {
        for (let i = 0; i < SEGMENTS; i++) {
          const current = this.pathSegments[i];
          const next = this.pathSegments[(i + 1) % SEGMENTS];
          
          if (current < 0.2 && next < 0.2) continue;

          const angle1 = (i * 2 * Math.PI) / SEGMENTS - Math.PI;
          const angle2 = ((i + 1) * 2 * Math.PI) / SEGMENTS - Math.PI;

          const x1 = center + Math.cos(angle1) * current * radius;
          const y1 = center + Math.sin(angle1) * current * radius;
          const x2 = center + Math.cos(angle2) * next * radius;
          const y2 = center + Math.sin(angle2) * next * radius;

          // Compute average of current and next magnitude and use it to get the hue.
          const cc = (current + next) / 2;
          const hue = this.cc_to_color(cc);

          ctx.beginPath();
          ctx.moveTo(center, center);
          ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.closePath();
          ctx.fillStyle = `hsla(${parseInt(hue)}, 100%, 50%, 0.5)`;
          ctx.fill();
        }
      }

      // Draw current position
      ctx.beginPath();
      ctx.arc(
        center + xPos * radius,
        center + yPos * radius,
        5, 0, Math.PI * 2
      );
      ctx.fillStyle = "#00c0ff";
      ctx.fill();
    }
  }
};
</script>

<style scoped>
.stick-visualization {
  background: #2d2d2d;
  padding: 1rem;
  border-radius: 8px;
  color: white;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.controls button {
  background: #444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.controls button:hover {
  background: #555;
}

.stick-canvas {
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.stats {
  background: #333;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
}

.stats p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

input[type="checkbox"] {
  margin-right: 0.5rem;
}

.visualization-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
