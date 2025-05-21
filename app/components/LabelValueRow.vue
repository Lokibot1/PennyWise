<script setup lang="ts">
defineProps<{
  label: string;
  value: number | null;
  classModifier?: string | object;
}>();
</script>

<template>
  <div class="flex justify-between items-center pt-2 border-t border-gray-100">
    <span class="text-sm text-gray-500 dark:text-white">{{ label }}</span>
    <span class="font-medium" :class="classModifier"> ₱{{ value }} </span>
  </div>
</template>
