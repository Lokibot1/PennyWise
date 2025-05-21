<script setup lang="ts">
import { RefreshCcw } from "lucide-vue-next";
const refreshCategories = inject("refreshCategories");

type ExpenseType = {
  id: number;
  items: string;
  category_id: number;
  spent: string;
};

const toast = useToast();
const baseUrl = useRuntimeConfig().public.baseUrl;
const emit = defineEmits(["close-archives"]);
const expenses = ref<Array<ExpenseType>>([]);

await useFetch(`${baseUrl}/specifics/archives`, {
  method: "GET",
  onResponse({ response }) {
    if (response.status === 200) {
      console.log("Fetched archived expenses:", response._data);
      expenses.value = response._data;
    } else {
      console.error("Error fetching archived expenses:", response.statusText);
    }
  },
});

//Restore archived expenses
const restore = async (id: number) => {
  await useFetch(`${baseUrl}/specifics/restore/${id}`, {
    method: "PATCH",
    onResponse({ response }) {
      if (response.status === 200) {
        toast.add({
          title: "Success",
          description: "Expenses restored successfully!",
          color: "success",
        });
        console.log("Restored archived expense:", response._data);
        refreshCategories.value++; //instant reflect ng data
        emit("close-archives");
      } else {
        toast.add({
          title: "Error",
          description: "Failed to restore expenses.",
          color: "error",
        });
        console.error("Error restoring archived expense:", response.statusText);
      }
    },
  });
};
</script>

<template>
  <div v-if="expenses.length === 0" class="text-center py-10">
    <p class="text-gray-500">No archived incomes found.</p>
  </div>
  <div
    v-for="item in expenses"
    v-else
    :key="item.id"
    class="px-4 py-5 sm:p-6 flex justify-between items-center mb-4 rounded-md bg-white shadow-sm hover:shadow-xl transition-all"
  >
    <!-- Content goes here -->
    <div>
      <h2 class="text-l font-semibold text-gray800">
        {{ item.items }}
      </h2>
      <p class="text-xs font-normal text-gray-500">₱ {{ item.spent }}</p>
    </div>
    <div class="flex items-center gap-4">
      <div class="grid gap-2">
        <UTooltip
          :content="{
            align: 'center',
            side: 'bottom',
            sideOffset: 1,
          }"
          :delay-duration="0"
          text="Restore Expenses"
        >
          <UButton color="neutral" variant="ghost" @click="restore(item.id)">
            <RefreshCcw :size="18" />
          </UButton>
        </UTooltip>
      </div>
    </div>
  </div>
</template>
