<script setup lang="ts">
import { BanknoteArrowUp, BanknoteArrowDown, Moon, Sun } from "lucide-vue-next";
import IncomeForm from "@/components/IncomeForm.vue";
import CategoryForm from "@/components/CategoryForm.vue";
import ArchiveIcon from "@/components/icons/ArchiveIcon.vue";
import Archives from "@/components/Archives.vue";

useHead({
  titleTemplate: "%s - Budget Tracker",
});

const refreshCategories = ref(0);
provide("refreshCategories", refreshCategories);

const openAddIncome = ref(false);
const openAddCategory = ref(false);
const openArchives = ref(false);
const baseUrl = useRuntimeConfig().public.baseUrl;

// Dark mode toggle
const isDark = ref(false);

function toggleDark() {
  isDark.value = !isDark.value;
  const html = document.documentElement;
  if (isDark.value) {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
}

type IncomeDTO = {
  source_of_income: string;
  amount: number;
};

const submitNewIncome = (data: IncomeDTO) => {
  openAddIncome.value = false;
  useFetch(`${baseUrl}/income_sources`, {
    method: "POST",
    body: data,
  });
};

type ExpenseDTO = {
  budget: number;
  category_id: number;
};

//allocate new budget to categories
const submitAddExpenses = async (data: ExpenseDTO) => {
  await useFetch(`${baseUrl}/budget_and_balance/${data.category_id}`, {
    method: "POST",
    body: data,
  });
  refreshCategories.value++; // instant reflection of data
  openAddCategory.value = false;
};
</script>
<template>
  <UApp :toaster="{ position: 'top-right' }">
    <html class="h-full" :class="{ dark: isDark }">
      <body class="h-full bg-gray-100 dark:bg-gray-900">
        <div
          class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-[80px] lg:flex-col"
        >
          <!-- Sidebar component, swap this element with another sidebar if you like -->
          <div
            class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 dark:bg-gray-800 dark:border-gray-700 dark:bg-gray-900"
          >
            <div class="flex h-16 shrink-0 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10em"
                height="10em"
                viewBox="0 0 29 20"
              >
                <path
                  fill="currentColor"
                  d="M23.349 8.714c-.005.005-.333.339-.521.542c-.484.531-1.224 1.302-1.745 1.495h-.005c-.073-.021-.141-.047-.214-.068l.938-1.896l-.01.016c-.031.057-.958 1.885-2.219 1.62l-.005.005c-.021-.005-.036 0-.052-.005c.604-.771.839-1.484.839-1.484s-1.005 1.62-2.255 1.182a.1.1 0 0 1-.063-.063a.2.2 0 0 1 0-.104c.01-.057.052-.125.089-.188c.125-.234.344-.495.344-.495s-.208.203-.49.396l-.005.005c-.208.141-.458.276-.693.313a.8.8 0 0 1-.219 0c-.286-.052-.281-.333-.203-.609c.083-.271.234-.531.234-.531s-.255.396-.531.781c-.214.297-.417.526-.552.63l-.161.005c-.083-.234.13-1.005.13-1.01a7 7 0 0 1-.417.594q-.195.26-.453.448h-.036q-.163.017-.318.042a.26.26 0 0 1-.083-.167c-.057-.359.161-1.01.167-1.016c-.005.005-.125.344-.281.667v.005c-.042.094-.094.161-.146.24c-.115.182-.234.323-.344.292c-.172-.052-.271-.271-.328-.474c-.063-.203-.078-.401-.078-.401s-.042.339-.156.651a1.1 1.1 0 0 1-.193.349c-.031.036-.078.052-.115.073c-1.198.214-2.37.557-3.49 1.021c-.297.109-.594.214-.901.344c-1 .427-2.036.964-3.12 1.661a28.5 28.5 0 0 0-3.417 2.594a41 41 0 0 0-1.833 1.719c4.745-2.552 6.625-6.323 15.51-6.656c6.724-.255 9.865 2.849 10.906 2.891c2.604.109 4.339-1.865 4.896-2.594c.146-.188.234-.318.24-.328c-.01.016-.438.5-1.036.964l-.01.005c-.615.469-1.401.906-2.099.802h-.005c-.089-.016-.182-.01-.271-.047c.99-.578 1.646-1.583 1.974-2.125c.104-.167.313-.479.313-.479s-2.328 2.385-4.063 2.224c-.073-.005-.141.01-.208-.005c.755-.594 1.313-1.391 1.703-2.063v-.005h.005a9 9 0 0 0 .641-1.323c-.005.01-.432.661-1.021 1.38l-.01.016c-.589.719-1.333 1.495-1.953 1.734c-.094.031-.188.083-.271.094c1.443-1.281 2.052-3.094 2.052-3.094s-1.464 2.125-2.703 2.516c-.073.021-.151.063-.229.073c.76-.682 1.161-1.229 1.411-1.656c.318-.536.375-.865.375-.865l-.005.005q-.179.225-.365.443l-.021.021c-.339.401-.859.979-1.391 1.438l-.005.005q-.21.178-.427.333c-.042.026-.083.063-.12.089c-.115.068-.24.13-.365.182c-.031.01-.057.031-.089.042c-.089-.063-.172-.125-.271-.182c-.063.078-.13.156-.188.234h-.005c-.026-.005-.057-.005-.083-.021c1.146-1.245 1.922-2.823 1.922-2.823l-.01.005c-.01.01-1.589 2.146-2.302 2.276a5 5 0 0 0-.286-.135a.7.7 0 0 1 .057-.219c.161-.375.62-.953.62-.953l-.167.125q-.197.171-.401.318c-.078.057-.156.099-.229.146c-.089.052-.172.104-.255.141a.9.9 0 0 1-.349.115c-.057 0-.109-.005-.146-.036c.604-.37 1.635-2.172 1.646-2.182zm-6.391 2.885a25 25 0 0 0-1.214.01c-.385.016-.734.042-1.094.073a4.7 4.7 0 0 0-1.047.615a.55.55 0 0 1-.016.474l1.182.859l.031-.021l-.484-1.688l.833 1.49l.083-.031l-.026-1.646l.531 1.552l.63-1.536l.026 1.693q.007.009.016.01l.948-1.339l-.484 1.625l.01.01l1.391-.922l-1.01 1.401v.01l1.266-.453c.016-.026.042-.042.057-.068c-.313-.385.042-.948.526-.839c.156-.328.281-.672.359-1.026a18 18 0 0 0-2.51-.255zm-3.338.182h-.031c-.406.047-.807.104-1.188.167s-.75.135-1.099.214h-.016a4.7 4.7 0 0 0 .703 1.443c.146-.318.328-.615.536-.885a.581.581 0 0 1 .76-.74c.104-.078.224-.13.333-.198zm5.943.12a4.2 4.2 0 0 1-.214 1.104c.385.349.073.984-.438.906a4.3 4.3 0 0 1-.734.839l.88.047l-1.323.313c-.036.026-.063.057-.099.078c.755.12 1.464.438 2.052.922a5.3 5.3 0 0 0 .672-2.589c0-.714-.318-1.234-.792-1.62zm-8.422.302q-.595.142-1.135.307a1.97 1.97 0 0 0-.281 1.01a5.32 5.32 0 0 0 3.141 4.854l.005-.016a4.1 4.1 0 0 1-.776-1.052c-.854.12-1.219-1.052-.448-1.438a4.3 4.3 0 0 1 .188-1.854a4.2 4.2 0 0 1-.693-1.813zm10.172.037c.188.547.302 1.12.302 1.724c0 3.25-2.938 5.891-6.563 5.891c-3.62 0-6.557-2.641-6.557-5.891c0-.318.031-.625.083-.927a17.7 17.7 0 0 0-2.766 1.484c-.286.516-.427 1.057-.38 1.599c.115 1.313 1.271 2.406 3.036 3.151l-.344-.089c-3.052-.865-5.474.667-8.125-.661c.615.484 1.313.958 3.328.964c.688 0 2.88-.109 3.286.25c.401.349-1.365 2.016-1.365 2.016s2.99-2.531 3.276-1.667c.182.536-.854 1.969-.854 1.969s1.042-1.411 1.818-1.714c.531-.208.979-.182 1.365.354c.25.349-1.214 2.068-1.214 2.068s1.969-1.917 2.318-1.818c.354.099 0 1.818 0 1.818s.729-1.74 1.115-1.87c.531-.177-1.214 4.042-1.214 4.042s2.13-3.901 2.526-3.99c.682-.151 1.135 2.724 1.135 2.724s-.333-2.516.026-2.677c2.26-1.021.958 4.344.958 4.344s1.479-3.641.573-4.448c2.396 1.589 2.104 4.448 2.104 4.448s.625-1.359-1.141-4.708c.958-.047 2.401 2.49 2.401 2.49s-1.568-2.776-.505-2.828c2.104-.099 2.318 3.688 2.318 3.688s.635-.531-1.057-4.24c1.078-.693 3.682 3.427 3.682 3.427s-2.401-4.021-2.016-4.292c.385-.266 1.797 1.281 1.797 1.281s-1.073-1.479-.792-1.63c.286-.151 3.151 2.943 3.151 2.943s-2.526-3.026-2.089-3.401c.438-.37 2.286 1.047 2.286 1.047s-2.844-1.865-2.286-2.156c.771-.401 2.979.958 2.979.958s-1.328-1.094-1.109-1.359c.219-.271 2.828 1.714 2.828 1.714S27.32 16.45 27.2 15.997c-.115-.453 1.818.151 1.818.151s-2.135-.99-2.167-1.276c-.036-.286 1.411.318 1.411.318s-1.984-1.63-2.474-.302c-.109.214-.25.401-.375.599c.12-.359.177-.724.146-1.094a2 2 0 0 0-.073-.37c-.906-.49-2.266-1.245-4.177-1.781zm-7.771.604a.57.57 0 0 1-.677.219c-.073.099-.135.203-.198.307l1.703.625c.016-.016.026-.036.042-.057zm-.881.526c-.125.208-.24.422-.323.656c.161.167.349.313.526.453l1.229-.036l.005-.005zm5.584.724l-.807.615l.073.005q.398-.266.734-.62m-6.047.385q-.001.024-.01.047a3.8 3.8 0 0 0-.063 1.281a.75.75 0 0 1 .599.63l1.25-.802c-.115-.042-.229-.078-.333-.125l-1.401-.104l.849-.188a4.3 4.3 0 0 1-.891-.74zm1.057.281c.188.115.375.214.573.302l.156-.036c0-.021.005-.047.005-.073zm4.162.912l1.224 1.198l-1.599-.62l.938 1.438l-1.432-1.109l-.016.005l.464 1.708l-.797-1.516l-.125 1.771l-.542-1.766l-.625 1.682l.151-1.813l-.021-.01l-1.083 1.536l.396-1.479a4.4 4.4 0 0 0-1.057 1.589c.125.135.26.26.401.385a5.31 5.31 0 0 0 5.802-2.255a4.6 4.6 0 0 0-1.677-.719zm-3.245.297l-1.438.516c0 .026.01.047.01.068a.77.77 0 0 1-.245.563q.203.437.5.818a4.3 4.3 0 0 1 .427-.844l-.396.318zm4.844 3.719c-.25.063-.495.13-.75.182c.255-.052.5-.12.75-.182M17.563 20c-.151.026-.302.063-.453.083c-.271.042-.521.057-.781.083q.633-.064 1.234-.167zm-1.803.229c-.146.01-.286.005-.432.016c.151-.01.286-.005.432-.016"
                />
              </svg>
            </div>
            <div class="flex items-center">
              <!-- Dark mode toggle button -->
              <UButton
                class="mt-4 flex items-center justify-center rounded-full p-2 transition-colors bg-white dark:bg-white mr-3.5"
                @click="toggleDark"
                aria-label="Toggle dark mode"
              >
                <Sun v-if="!isDark" class="text-black" />
                <Moon v-else class="text-black" />
              </UButton>
            </div>
            <nav class="flex flex-1 flex-col">
              <ul role="list" class="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" class="-mx-2">
                    <li class="space-y-4">
                      <!-- Current: "bg-gray-50 text-indigo-600", Default: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50" -->
                      <UTooltip
                        :content="{
                          align: 'center',
                          side: 'right',
                          sideOffset: 8,
                        }"
                        :delay-duration="0"
                        text="Add Income"
                      >
                        <UButton
                          color="neutral"
                          variant="ghost"
                          @click="openAddIncome = true"
                        >
                          <BanknoteArrowUp />
                        </UButton>
                      </UTooltip>
                      <UTooltip
                        :content="{
                          align: 'center',
                          side: 'right',
                          sideOffset: 8,
                        }"
                        :delay-duration="0"
                        text="Allocate Budget"
                      >
                        <UButton
                          color="neutral"
                          variant="ghost"
                          @click="openAddCategory = true"
                        >
                          <BanknoteArrowDown />
                        </UButton>
                      </UTooltip>
                      <UTooltip
                        :content="{
                          align: 'center',
                          side: 'right',
                          sideOffset: 8,
                        }"
                        :delay-duration="0"
                        text="View Archives"
                      >
                        <UButton
                          color="neutral"
                          variant="ghost"
                          @click="openArchives = true"
                        >
                          <ArchiveIcon />
                        </UButton>
                      </UTooltip>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <main class="py-10 lg:pl-[80px]">
          <div class="px-4 sm:px-6 lg:px-8">
            <!-- Your content -->
            <NuxtPage />
          </div>
        </main>
        <!-- Add Income -->
        <USlideover
          v-model:open="openAddIncome"
          title="Add New Income"
          description="Add new revenue stream"
          direction="right"
          :dismissible="false"
        >
          <template #body>
            <IncomeForm
              class="min-w-96 min-h-96 mr-4"
              @handle-add-income="submitNewIncome"
              @close-archives="openAddIncome = false"
            />
          </template>
        </USlideover>
        <!-- Category Expenses -->
        <USlideover
          v-model:open="openAddCategory"
          title="Allocate Budget"
          description="Allocate a new budget to your categories"
          direction="right"
          :dismissible="false"
        >
          <template #body>
            <CategoryForm
              class="min-w-96 min-h-96 mr-4"
              @submit="submitAddExpenses"
            />
          </template>
        </USlideover>
        <!-- Archives -->
        <USlideover
          v-model:open="openArchives"
          title="Archives"
          description="View archived incomes or expenses."
          direction="right"
          :dismissible="false"
        >
          <template #body>
            <Archives
              class="min-w-96 min-h-96 mr-4"
              @update:open-archives="openArchives = $event"
            />
          </template>
        </USlideover>
      </body>
    </html>
  </UApp>
</template>
