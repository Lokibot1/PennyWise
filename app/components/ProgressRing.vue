<script setup lang="ts">
import { computed, defineProps } from "vue";

const props = defineProps<{
  expenses: number;
  budget: number | null;
}>();

const radius = 45;
const circumference = 2 * Math.PI * radius;

const percentage = computed(() => {
  if (props.budget === null) return 0; // Avoid division by zero

  const raw = (props.expenses / props.budget) * 100;
  return Math.min(Math.max(raw, 0), 100); // Clamp between 0–100
});

const dashOffset = computed(() => {
  return circumference - (percentage.value / 100) * circumference;
});

function getStrokeColor(percentage: number): string {
  if (percentage >= 80) return "#ef4444"; // red
  if (percentage >= 50) return "#f59e0b"; // orange
  if (percentage <= 25) return "#22c55e"; // green
  return "#3b82f6"; // blue
}
</script>

<template>
  <div class="flex justify-center py-2">
    <div class="relative w-32 h-32 flex items-center justify-center">
      <svg class="w-full h-full absolute" viewBox="0 0 100 100">
        <!-- Background ring -->
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e5e7eb"
          stroke-width="8"
        />

        <!-- Progress ring -->
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          :stroke="getStrokeColor(percentage)"
          stroke-width="8"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          transform="rotate(-90 50 50)"
        />
      </svg>

      <!-- Percentage text -->
      <div class="relative z-10 text-center">
        <p class="text-2xl font-bold text-gray-700 dark:text-white">
          {{ Math.round(percentage) }}%
        </p>
        <p class="text-xs text-gray-500 dark:text-white">used</p>
      </div>
    </div>
  </div>
</template>
