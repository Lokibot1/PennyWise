<script setup lang="ts">
import {
  Utensils,
  Zap,
  Bus,
  ShoppingCart,
  Home,
  Briefcase,
  Palette,
  Plane,
  Wallet,
} from "lucide-vue-next";
import { ref, computed, onMounted } from "vue";
import ProgressRing from "./ProgressRing.vue";
import CategoryCardHeader from "./CategoryCardHeader.vue";

const refreshTrigger = ref(0);
const refreshCategories = inject("refreshCategories");

async function refreshData() {
  // Your logic to re-fetch or reload data
  console.log("Reloading data in CategoryCards...");
  await execute();
}

// Watch for trigger changes
watch(refreshTrigger, () => {
  refreshData();
});

provide("triggerCategoryCardsReload", () => {
  refreshTrigger.value++;
});

// const items: DropdownMenuItem[] = [
//   [
//     {
//       label: "Add Expenses",
//       icon: "i-lucide-pencil",
//     },
//   ],
//   [
//     {
//       label: "Archive",
//       color: "error",
//       icon: "i-lucide-trash",
//     },
//   ],
// ];

type Category = {
  id: number;
  name: string;
  budget: number | null;
  expenses: number;
};

// Fetch categories from the backend
const categoriesData = ref<Array<Category>>([]);

// Fetch categories from the backend
const { execute } = useFetch("/categories", {
  method: "GET",
  immediate: false, // Do not fetch immediately; we'll trigger it manually
  baseURL: useRuntimeConfig().public.baseUrl, // Use the runtime-configured base URL
  onResponse({ response }) {
    if (response.status === 200) {
      categoriesData.value = response._data;
    } else {
      categoriesData.value = [];
    }
  },
});

// Watch for refresh trigger changes
watch(refreshCategories, async () => {
  await execute();
});

onMounted(async () => {
  await execute(); // Trigger the API call
});

// Icon mapping to assign icons based on category name
const iconMapping = {
  Food: Utensils,
  Utilities: Zap,
  Personal: Briefcase,
  Transport: Bus,
  Grocery: ShoppingCart,
  Rent: Home,
  Other: Plane,
  Entertainment: Palette,
  Savings: Wallet,

  // Add more mappings as needed
};

// Process categories to ensure they have all required properties
const categories = computed(() => {
  if (!Array.isArray(categoriesData.value)) return [];

  return categoriesData.value.map((category) => ({
    id: category.id,
    name: category.name,
    icon: iconMapping[category.name as keyof typeof iconMapping], // Fallback icon
    budget: category.budget, // Default budget
    expenses: category.expenses, // Default expenses
    color: "bg-gray-500", // Fallback color
  }));
});
</script>

<template>
  <div v-if="categories.length === 0" class="text-center py-10">
    <p class="text-gray-500">Loading categories...</p>
  </div>

  <div v-else class="flex flex-wrap gap-3 justify-start">
    <div
      v-for="category in categories"
      :key="category.id"
      class="w-full sm:w-112 rounded-xl bg-white overflow-hidden transition-all hover:shadow-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-2xl dark:shadow-gray-900/40"
    >
      <div class="p-8 space-y-5">
        <!-- Header with category name and icon -->
        <CategoryCardHeader
          :category="{
            id: category.id,
            name: category.name,
            icon: category.icon,
            color: category.color,
          }"
        />

        <!-- Ring Chart -->
        <ProgressRing :expenses="category.expenses" :budget="category.budget" />

        <!-- Financial Info -->
        <div class="space-y-3">
          <!-- Budget -->
          <LabelValueRow label="Budget" :value="category.budget" />

          <!-- Expenses -->
          <LabelValueRow label="Expenses" :value="category.expenses" />

          <!-- Balance -->
          <LabelValueRow
            label="Balance"
            :value="
              category.budget === null ? 0 : category.budget - category.expenses
            "
            :class-modifier="{
              'text-green-600':
                category.budget === null
                  ? 0
                  : category.budget - category.expenses >= 0,
              'text-red-600':
                category.budget === null
                  ? 0
                  : category.budget - category.expenses < 0,
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
