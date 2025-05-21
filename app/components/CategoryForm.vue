<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

type Category = {
  id: number;
  name: string;
};

const categories = ref([]);
const showBudgetError = ref(false);
const budgetError = ref("");

onMounted(async () => {
  await executeCategories();
});

// Get all categories from api
const { execute: executeCategories } = await useFetch("/categories", {
  method: "GET",
  immediate: false,
  baseURL: useRuntimeConfig().public.baseUrl,
  onResponse({ response }) {
    if (response.status === 200) {
      categories.value = response._data.map((category: Category) => ({
        label: category.name,
        value: category.id,
      }));
      state.selectedCategory = 1; // Set default selected category
    } else {
      console.error("Error fetching categories:", response.statusText);
    }
  },
});

const schema = z.object({
  selectedCategory: z.number(),
  categoryBudget: z.number().min(0, "Budget must be a positive number"),
  categorySpecifics: z.array(z.string()).optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  selectedCategory: undefined,
  categoryBudget: undefined,
  categorySpecifics: undefined,
});

const toast = useToast();
const loading = ref(false);

const fieldSpecifics = ref([
  {
    value: "",
  },
]);

const emit = defineEmits<{
  (e: "submit", event: FormSubmitEvent<Schema>): void;
}>();

const onSubmit = async () => {
  loading.value = true;
  showBudgetError.value = false; // Reset error state

  state.categorySpecifics = fieldSpecifics.value
    .map((item) => item.value)
    .filter((value) => value.trim() !== "");

  try {
    const response = await $fetch(
      `${useRuntimeConfig().public.baseUrl}/budget_and_balance/${
        state.selectedCategory
      }`,
      {
        method: "POST",
        body: {
          budget: state.categoryBudget,
        },
      }
    );

    emit("submit", {
      budget: state.categoryBudget,
      category_id: state.selectedCategory,
    });

    toast.add({
      title: "Success",
      description: "Budget allocated successfully!",
      color: "success",
    });
    await executeCategories();
  } catch (error) {
    if (error?.response?.status === 406) {
      // Budget exceeds income error
      budgetError.value =
        "Total budget exceeds monthly income! Please adjust your budget.";
      showBudgetError.value = true;
      // Don't close the drawer - just show the error
    } else {
      toast.add({
        title: "Error",
        description: "Failed to allocate budget",
        color: "error",
      });
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <div v-if="showBudgetError" class="flex items-start mb-4">
      <UIcon
        name="i-heroicons-exclamation-triangle"
        class="h-5 w-5 text-red-500 mr-2 mt-0.5"
      />
      <p class="text-sm text-red-500">{{ budgetError }}</p>
    </div>

    <UFormField label="Category" name="selectedCategory">
      <USelect
        v-model="state.selectedCategory"
        :items="categories"
        :default-value="1"
        class="w-full"
        placeholder="Select a category"
      />
    </UFormField>

    <UFormField label="Alloted Budget" name="categoryBudget">
      <UInput v-model="state.categoryBudget" type="number" class="w-full" />
    </UFormField>

    <UButton
      type="submit"
      :loading="loading"
      :disabled="loading"
      color="primary"
    >
      {{ loading ? "Submitting..." : "Submit" }}
    </UButton>
  </UForm>
</template>
