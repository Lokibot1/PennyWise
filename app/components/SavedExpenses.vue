<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "vue-chartjs";
import { ref, computed, onMounted } from "vue";

ChartJS.register(ArcElement, Tooltip, Legend);

type SavedExpenses = {
  month: string;
  total_budget: number;
  total_expense: number;
  savings: number;
};

const savings = ref<Array<SavedExpenses>>([]);
const isLoading = ref(true);

// Generate a computed property for chart data based on savings
const data = computed(() => {
  if (savings.value.length === 0) {
    // Return empty data when no savings
    return {
      labels: ["No savings yet"],
      datasets: [
        {
          label: "Savings",
          backgroundColor: ["#e0e0e0"],
          data: [1], // Single placeholder value
        },
      ],
    };
  }

  // Extract month names and savings values
  const months = savings.value.map((item) => {
    // Convert "YYYY-MM" format to month name
    const [year, month] = item.month.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString("default", { month: "long" });
  });

  const savingsValues = savings.value.map((item) => item.savings);

  // Generate colors (one for each month)
  const backgroundColors = [
    "#41B883",
    "#E46651",
    "#00D8FF",
    "#DD1B16",
    "#FFA500",
    "#9966CC",
    "#20B2AA",
    "#FF6347",
    "#4682B4",
    "#228B22",
    "#B22222",
    "#4B0082",
  ];

  return {
    labels: months,
    datasets: [
      {
        label: "Savings",
        backgroundColor: backgroundColors.slice(0, months.length),
        data: savingsValues,
      },
    ],
  };
});

const options = ref({
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: (ctx) => {
          // White in dark mode, dark in light mode
          return document.documentElement.classList.contains("dark")
            ? "#fff"
            : "#222";
        },
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.label}: ₱${context.raw}`;
        },
      },
    },
  },
});

// Empty chart options when no data
const emptyOptions = computed(() => {
  if (savings.value.length === 0) {
    return {
      ...options.value,
      plugins: {
        ...options.value.plugins,
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      elements: {
        arc: {
          backgroundColor: "#e0e0e0",
        },
      },
    };
  }
  return options.value;
});

const { execute } = useFetch("/savings", {
  method: "GET",
  immediate: false, // Do not fetch immediately; we'll trigger it manually
  baseURL: useRuntimeConfig().public.baseUrl, // Use the runtime-configured base URL
  onResponse({ response }) {
    if (response.status === 200) {
      console.log("Savings data:", response._data);
      savings.value = response._data;
    } else {
      savings.value = [];
    }
    isLoading.value = false;
  },
});

onMounted(async () => {
  await execute(); // Initial fetch

  setInterval(() => {
    execute();
  }, 2000);
});
</script>

<template>
  <div
    class="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-2xl dark:shadow-gray-900/40"
  >
    <div class="px-4 py-5 sm:p-6">
      <h2 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
        Monthly Saved Expenses
      </h2>

      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div
          class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"
        ></div>
      </div>

      <div v-else>
        <div
          v-if="savings.length === 0"
          class="flex justify-center items-center h-64"
        >
          <Pie :data="data" :options="emptyOptions" />
          <div
            class="absolute text-gray-500 text-lg font-medium :dark:text-white"
          >
            No savings yet
          </div>
        </div>
        <div v-else class=":dark:text-white">
          <Pie :data="data" :options="options" />
        </div>
      </div>
    </div>
  </div>
</template>
