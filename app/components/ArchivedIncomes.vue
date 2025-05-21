<script setup lang="ts">
import { RefreshCcw } from "lucide-vue-next";

const toast = useToast();
const baseUrl = useRuntimeConfig().public.baseUrl;
const emit = defineEmits(["close-archives"]);
const income = ref<Array<IncomeType>>([]);

type IncomeType = {
  id: number;
  amount: number;
  source_of_income: string;
};

await useFetch(`${baseUrl}/income_sources/archived`, {
  method: "GET",
  onResponse({ response }) {
    if (response.status === 200) {
      console.log("Fetched archived expenses:", response._data);
      income.value = response._data;
    } else {
      console.error("Error fetching archived expenses:", response.statusText);
    }
  },
});

const restore = async (id: number) => {
  await useFetch(`${baseUrl}/income_sources/restore/${id}`, {
    method: "PATCH",
    onResponse({ response }) {
      if (response.status === 200) {
        toast.add({
          title: "Success",
          description: "Income restored successfully!",
          color: "success",
        });
        emit("close-archives");
      } else {
        toast.add({
          title: "Error",
          description: "Failed to restore income.",
          color: "error",
        });
      }
    },
  });
};
</script>

<template>
  <h2 class="text-lg font-medium leading-6 text-highlighted" />
  <div v-if="income.length === 0" class="text-center py-10">
    <p class="text-gray-500">No archived incomes found.</p>
  </div>

  <div
    v-for="item in income"
    v-else
    :key="item.id"
    class="px-4 py-5 sm:p-6 flex justify-between items-center mb-4 rounded-md bg-white shadow-sm hover:shadow-xl transition-all"
  >
    <!-- Income Source and Amount -->
    <div>
      <h2 class="text-l font-semibold text-gray-800">
        {{ item.source_of_income }}
      </h2>
      <p class="text-xs font-normal text-gray-500">₱ {{ item.amount }}</p>
    </div>

    <!-- Restore Icon -->
    <div>
      <div class="flex items-center">
        <div class="">
          <UTooltip
            :content="{
              align: 'center',
              side: 'bottom',
              sideOffset: 1,
            }"
            :delay-duration="0"
            text="Restore Income"
          >
            <UButton color="neutral" variant="ghost" @click="restore(item.id)">
              <RefreshCcw :size="18" />
            </UButton>
          </UTooltip>
        </div>
      </div>
    </div>
  </div>
</template>
