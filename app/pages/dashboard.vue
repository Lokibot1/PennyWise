<script setup lang="ts">
import IncomeAndExpenses from "~/components/IncomeAndExpenses.vue";
import SavedExpenses from "~/components/SavedExpenses.vue";
import CategoryCards from "~/components/CategoryCards.vue";

definePageMeta({ title: "Dashboard" });
useHead({ title: "Dashboard" });
</script>

<template>
  <div class="grid grid-cols-3 gap-4 dark:text-white">
    <IncomeAndExpenses />

    <SavedExpenses />

    <div class="grid col-span-3">
      <CategoryCards />
    </div>
  </div>
</template>
