<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type IncomeExpenses = {
  id: number;
  month_name: string;
  total_expense: string;
  total_income: string;
};

const incomeAndExpenses = ref<Array<IncomeExpenses>>([]);

const { execute } = useFetch("/income_sources_with_expenses", {
  method: "GET",
  immediate: false, // Do not fetch immediately; we'll trigger it manually
  baseURL: useRuntimeConfig().public.baseUrl, // Use the runtime-configured base URL
  onResponse({ response }) {
    if (response.status === 200) {
      console.log(response._data);
      incomeAndExpenses.value = response._data;
    } else {
      incomeAndExpenses.value = [];
    }
  },
});

onMounted(async () => {
  await execute(); // Initial fetch

  setInterval(() => {
    execute();
  }, 2000);
});

const data = computed(() => ({
  labels: incomeAndExpenses.value.map((item) => item.month_name),
  datasets: [
    {
      label: "Income",
      data: incomeAndExpenses.value.map((item) => Number(item.total_income)),
      borderColor: "#4CAF50",
      backgroundColor: "#4CAF50",
      fill: false,
    },
    {
      label: "Expenses",
      data: incomeAndExpenses.value.map((item) => Number(item.total_expense)),
      borderColor: "#F44336",
      backgroundColor: "#F44336",
      fill: false,
    },
  ],
}));

const options = ref({
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: (ctx) => {
          // Use white in dark mode, default otherwise
          return document.documentElement.classList.contains("dark")
            ? "#fff"
            : "#222";
        },
      },
    },
    title: {
      display: true,
      text: "Year 2025 - Monthly Income and Expenses",
      color: (ctx) => {
        return document.documentElement.classList.contains("dark")
          ? "#fff"
          : "#222";
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: (ctx) => {
          return document.documentElement.classList.contains("dark")
            ? "#fff"
            : "#222";
        },
      },
      grid: {
        color: (ctx) => {
          return document.documentElement.classList.contains("dark")
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.05)";
        },
      },
    },
    y: {
      ticks: {
        color: (ctx) => {
          return document.documentElement.classList.contains("dark")
            ? "#fff"
            : "#222";
        },
      },
      grid: {
        color: (ctx) => {
          return document.documentElement.classList.contains("dark")
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.05)";
        },
      },
    },
  },
});
</script>

<template>
  <div
    class="col-span-2 overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-2xl dark:shadow-gray-900/40"
  >
    <div class="px-4 py-5 sm:p-6">
      <!-- Content goes here -->
      <h2 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
        Total Monthly Income and Expenses
      </h2>

      <Line :data="data" :options="options" class="mt-4" />
    </div>
  </div>
</template>
