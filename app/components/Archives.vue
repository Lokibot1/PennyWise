<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import { ArchivedExpenses } from "#components";

const emit = defineEmits(["update:openArchives"]);

const items = [
  {
    label: "Income",
    description:
      "View your previous archived income here. You can restore it by clickign the restore icon",
    icon: "i-lucide-banknote-arrow-up",
    slot: "income" as const,
  },
  {
    label: "Expenses",
    description:
      "View your previous archived expenses here. You can restore it by clickign the restore icon",
    icon: "i-lucide-banknote-arrow-down",
    slot: "expenses" as const,
  },
] satisfies TabsItem[];

const handleCloseArchives = () => {
  emit("update:openArchives", false);
};

type ArchivedExpenseType = {
  id: number;
  items: string;
  category_id: number;
  spent: number;
};

// Fetch categories from the backend
const archivedExpenses = ref<Array<ArchivedExpenseType>>([]);

// Fetch categories from the backend
const { execute: execute } = await useFetch("/specifics/archives", {
  method: "GET",
  immediate: false,
  baseURL: useRuntimeConfig().public.baseUrl,
  onResponse({ response }) {
    if (response.status === 200) {
      archivedExpenses.value = response._data.map(
        (archived: ArchivedExpense) => ({
          label: archived.items,
          value: archived.id,
          category_id: archived.category_id,
          spent: archived.spent,
        })
      );
      state.selectedCategory = 1; // Set default selected category
    } else {
      console.error("Error fetching categories:", response.statusText);
    }
  },
});

onMounted(async () => {
  await execute(); // Trigger the API call
});
</script>

<template>
  <UTabs
    :items="items"
    variant="link"
    class="gap-4 w-12"
    :ui="{ trigger: 'grow' }"
  >
    <template #income="{ item }">
      <p class="text-muted mb-4">
        {{ item.description }}
      </p>

      <!-- Content goes here -->
      <div class="flex items-center gap-4">
        <div class="w-full">
          <ArchivedIncomes @close-archives="handleCloseArchives" />
        </div>
      </div>
    </template>

    <template #expenses="{ item }">
      <p class="text-muted mb-4">
        {{ item.description }}
      </p>
      <ArchivedExpenses @close-archives="handleCloseArchives" />
    </template>
  </UTabs>
</template>
