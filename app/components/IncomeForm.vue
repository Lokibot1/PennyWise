<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { Trash, Pencil } from "lucide-vue-next";

const schema = z.object({
  incomeSource: z.string().min(3, "Must be at least 3 characters"),
  incomeAmount: z.number().min(0, "Must be a positive number"),
  created_at: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  incomeSource: "",
  incomeAmount: undefined,
  created_at: undefined,
});

const baseUrl = useRuntimeConfig().public.baseUrl;
const toast = useToast();
const loading = ref(false);

type IncomeType = {
  id: number;
  amount: number;
  source_of_income: string;
  created_at: string;
};

const incomeSources = ref<Array<IncomeType>>([]);

const { execute } = useFetch("/income_sources", {
  method: "GET",
  immediate: false, // Do not fetch immediately; we'll trigger it manually
  baseURL: useRuntimeConfig().public.baseUrl, // Use the runtime-configured base URL
  onResponse({ response }) {
    if (response.status === 200) {
      console.log(response._data);
      incomeSources.value = response._data.filter(
        // Filter out archived incomes
        (income) => !income.is_archived
      );
    } else {
      incomeSources.value = [];
    }
  },
});

onMounted(async () => {
  await execute(); // Trigger the API call
});

const emit = defineEmits<{
  (e: "handleAddIncome", event: FormSubmitEvent<Schema>): void;
  (e: "close-archives"): void;
}>();

const onSubmit = async () => {
  loading.value = true;

  emit("handleAddIncome", {
    source_of_income: state.incomeSource,
    amount: state.incomeAmount,
  });

  toast.add({
    title: "Success",
    description: "New income added successfully!",
    color: "success",
  });

  // Reset form after successful submission
  state.source_of_income = "";
  state.amount = 0;
};

//Archive Income
const archiveIncome = async (id: number) => {
  const url = `${baseUrl}/income_sources/archive/${id}`;
  await useFetch(url, {
    method: "PATCH",
    onResponse({ response }) {
      if (response.status === 200) {
        toast.add({
          title: "Success",
          description: "Income archived successfully!",
          color: "success",
        });
        emit("close-archives");
      } else {
        toast.add({
          title: "Error",
          description: "Failed to archive income.",
          color: "error",
        });
      }
    },
  });
};

const editableItemId = ref<number | null>(null);
const editIncomeItem = (itemId: number) => {
  editableItemId.value = itemId;
  const itemToEdit = incomeSources.value.find((item) => item.id === itemId);
  if (itemToEdit) {
    state.incomeSource = itemToEdit.source_of_income;
    state.incomeAmount = itemToEdit.amount;
  }
};

const resetFormState = () => {
  state.incomeSource = "";
  state.incomeAmount = undefined;
};

const updateIncome = async (itemId: number) => {
  const url = `${baseUrl}/income_sources/${itemId}`;

  await useFetch(url, {
    method: "PATCH",
    body: {
      source_of_income: state.incomeSource,
      amount: state.incomeAmount,
    },
    async onResponse({ response }) {
      if (response.status === 200) {
        toast.add({
          title: "Success",
          description: "Income updated successfully!",
          color: "success",
        });
        editableItemId.value = null;
        resetFormState(); // Reset the form state
        await execute(); // Refresh the income sources
      } else {
        toast.add({
          title: "Error",
          description: "Failed to update income.",
          color: "error",
        });
      }
    },
  });
};

const cancelEdit = () => {
  editableItemId.value = null;
  resetFormState(); // Reset the form state
};
</script>

<template>
  <UForm
    v-if="editableItemId === null"
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField label="Income Source" name="incomeSource">
      <UInput
        v-model="state.incomeSource"
        class="w-full"
        placeholder="Salary, Freelance, etc."
      />
    </UFormField>

    <UFormField label="Income Amount" name="incomeAmount">
      <UInput
        v-model="state.incomeAmount"
        type="number"
        class="w-full"
        placeholder="Enter the income amount"
      />
    </UFormField>

    <UButton type="submit" :loading="loading" :disabled="loading">
      {{ loading ? "Submitting..." : "Submit" }}
    </UButton>
  </UForm>

  <div class="mt-15">
    <h2 class="text-highlighted font-semibold mb-4">Income Sources</h2>
    <hr class="border-t border-gray-200 mb-4" />
  </div>

  <div class="space-y-3">
    <h2 class="text-lg font-medium leading-6 text-highlighted" />

    <div
      v-for="item in incomeSources"
      :key="item.id"
      class="px-4 py-5 sm:p-6 flex justify-between items-center mb-4 rounded-md bg-white shadow-sm hover:shadow-xl transition-all space-x-3"
    >
      <div v-if="editableItemId !== item.id">
        <h2 class="text-l font-semibold text-gray-800">
          {{ item.source_of_income }}
        </h2>
        <p class="text-xs font-normal text-gray-500">₱ {{ item.amount }}</p>
        <p class="text-xs font-normal text-gray-500">{{ item.created_at }}</p>
      </div>

      <!-- When editing -->
      <div v-else class="space-y-3">
        <UInput v-model="state.incomeSource" class="w-full" />
        <UInput v-model="state.incomeAmount" class="w-full" type="number" />
      </div>

      <div>
        <div v-if="editableItemId === item.id">
          <UButton
            color="primary"
            variant="solid"
            @click="updateIncome(item.id)"
          >
            Save
          </UButton>

          <UButton
            color="error"
            variant="solid"
            class="my-1"
            @click="cancelEdit"
          >
            Cancel
          </UButton>
        </div>

        <div v-else class="flex items-center">
          <!-- Restore Icon -->
          <div class="grid gap-2">
            <UTooltip
              :content="{
                align: 'center',
                side: 'bottom',
                sideOffset: 1,
              }"
              :delay-duration="0"
              text="Archive Income"
            >
              <UButton
                color="neutral"
                variant="ghost"
                @click="archiveIncome(item.id)"
              >
                <Trash :size="18" />
              </UButton>
            </UTooltip>
          </div>

          <!-- Update Income -->
          <div class="flex items-center">
            <div class="grid gap-2">
              <UTooltip
                :content="{
                  align: 'center',
                  side: 'bottom',
                  sideOffset: 1,
                }"
                :delay-duration="0"
                text="Update Income"
              >
                <UButton
                  color="neutral"
                  variant="ghost"
                  @click="editIncomeItem(item.id)"
                >
                  <Pencil :size="18" />
                </UButton>
              </UTooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
