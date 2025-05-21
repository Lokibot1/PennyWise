<script setup lang="ts">
defineProps<{
  category: {
    id: number;
    name: string;
    icon: string | Component;
    color: string;
  };
}>();

const baseUrl = useRuntimeConfig().public.baseUrl;

const openArchiveExpenses = ref(false);
const loading = ref(false);
const archiveLoading = ref(false); // Separate loading state for archive
const toast = useToast();
const categoryId = ref<number>(0);
const newExpenseAmount = ref<number>(0);
const newExpenseDescription = ref<string>("");
const refreshCategories = inject("refreshCategories");

const triggerReload = inject<() => void>("triggerCategoryCardsReload");

const setCategoryId = (id: number) => {
  categoryId.value = id;
};

const addNewExpense = async () => {
  loading.value = true;
  try {
    await useFetch(`${baseUrl}/specifics`, {
      method: "POST",
      body: {
        category_id: categoryId.value,
        items: newExpenseDescription.value,
        spent: newExpenseAmount.value,
      },
    });

    triggerReload?.();
    toast.add({
      title: "Success",
      description: "New expense added successfully!",
      color: "success",
    });

    // Reset form and close modal
    resetAddExpenseForm();
    openAddExpenses.value = false;
  } finally {
    loading.value = false;
  }
};

// Reset add expense form
const resetAddExpenseForm = () => {
  newExpenseAmount.value = 0;
  newExpenseDescription.value = "";
};

// Reset archive form
const resetArchiveForm = () => {
  selectedExpenseId.value = 0;
  expensesItems.value = [];
};

type Expense = {
  id: number;
  category_id: number;
  items: string;
};

const expensesData = ref<Array<Expense>>([]);
const expensesItems = ref([]);
const openAddExpenses = ref(false);
const selectedExpenseId = ref(0);

// Watch modal state to reset when closed
watch(openAddExpenses, (newVal) => {
  if (!newVal) {
    resetAddExpenseForm();
    loading.value = false;
  }
});

watch(openArchiveExpenses, (newVal) => {
  if (!newVal) {
    resetArchiveForm();
    archiveLoading.value = false;
  }
});

// Get Expenses per category
const getCategory = async (categoryId: number) => {
  openArchiveExpenses.value = true;
  await useFetch(`${baseUrl}/specifics/category/${categoryId}`, {
    method: "GET",
    onResponse({ response }) {
      if (response.status === 200) {
        expensesItems.value = response._data.map((specifics: Expense) => ({
          value: specifics.id,
          label: specifics.items,
        }));
        selectedExpenseId.value = categoryId;
      } else {
        expensesData.value = [];
      }
    },
  });
};

const urlPath = computed(() => {
  return `${baseUrl}/specifics/${selectedExpenseId.value}`;
});

// Archive Expenses
const { status, execute: executeArchive } = await useFetch(urlPath, {
  method: "PATCH",
  immediate: false,
  onResponse({ response }) {
    if (response.status === 200) {
      toast.add({
        title: "Success",
        description: "Expenses archived successfully!",
        color: "success",
      });
      refreshCategories.value++;
    } else {
      toast.add({
        title: "Error",
        description: "Failed to archive expenses.",
        color: "error",
      });
    }
    archiveLoading.value = false;
    openArchiveExpenses.value = false;
  },
});

const handleArchive = async () => {
  archiveLoading.value = true;
  await executeArchive();
};
</script>

<template>
  <div class="grid grid-cols-3 items-center text-center">
    <h2 class="text-l font-semibold text-gray-800 text-left dark:text-white">
      {{ category.name }}
    </h2>

    <component
      :is="category.icon"
      class="w-6 h-6 mx-auto dark:text-white"
      :class="category.color.replace('bg-', 'text-')"
    />

    <div class="flex justify-end">
      <!-- Add New Expenses -->
      <UModal
        v-model:open="openAddExpenses"
        title="Add New Expenses"
        description="Add your expenses here to calculate your budget"
        @close="loading = false"
      >
        <UTooltip :delay-duration="0" text="Add Expenses">
          <UButton
            icon="i-lucide-wallet"
            color="neutral"
            variant="ghost"
            size="xl"
            @click="setCategoryId(category.id)"
          />
        </UTooltip>

        <template #body>
          <div class="space-y-5">
            <UFormField label="Spent Amount" name="spent">
              <UInput
                v-model="newExpenseAmount"
                class="w-full"
                placeholder="How much did you spend?"
                type="number"
              />
            </UFormField>

            <UFormField label="Item" name="description">
              <UInput
                v-model="newExpenseDescription"
                class="w-full"
                placeholder="Where did you spend it on?"
                type="text"
              />
            </UFormField>

            <div class="flex justify-end">
              <UButton
                type="submit"
                :loading="loading"
                :disabled="loading"
                label="Submit"
                color="neutral"
                @click="addNewExpense"
              >
                {{ loading ? "Submitting..." : "Submit" }}
              </UButton>
            </div>
          </div>
        </template>
      </UModal>

      <!-- Archive Expenses -->
      <UModal
        v-model:open="openArchiveExpenses"
        title="Archive Expenses"
        description="Archive your expenses to re-calculate your budget"
        @close="archiveLoading = false"
      >
        <UTooltip :delay-duration="0" text="Archive Expenses">
          <UButton
            icon="i-lucide-archive"
            color="neutral"
            variant="ghost"
            size="xl"
            @click="getCategory(category.id)"
          />
        </UTooltip>
        <template #body>
          <div class="space-y-5">
            <UFormField label="Previous Expenses" name="spent">
              <USelect
                v-model="selectedExpenseId"
                class="w-full"
                placeholder="Choose your previous expenses"
                :items="expensesItems"
              />
            </UFormField>

            <div class="flex justify-end">
              <UButton
                label="Archive"
                color="neutral"
                :loading="archiveLoading"
                :disabled="archiveLoading"
                @click="handleArchive"
              >
                {{ archiveLoading ? "Archiving..." : "Archive" }}
              </UButton>
            </div>
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>
