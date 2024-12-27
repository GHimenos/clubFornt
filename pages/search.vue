<template>
  <div>
    <div class="container mx-auto mt-2 p-5">
      <h1>Результати пошуку</h1>
      <div v-if="loading">Завантаження...</div>
      <div v-else-if="results.length">
        <ul>
          <li v-for="result in results" :key="result.id">
            {{ result.name }}
          </li>
        </ul>
      </div>
      <div v-else>
        <p>Нічого не знайдено.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const results = ref([]);
const loading = ref(false);

function fetchResults(query) {
  if (!query) return;
  loading.value = true;

  // Имитируем запрос к API
  setTimeout(() => {
    results.value = mockSearch(query);
    loading.value = false;
  }, 1000);
}

function mockSearch(query) {
  const mockData = [
    {
      id: 1,
      name: "МХП під урожай-2025 наростив площі під озимою пшеницею на 23%",
    },
    {
      id: 2,
      name: "Аукціони на оренду із ФДМ стартують 1 жовтня, їх оголошено вже 45",
    },
    { id: 3, name: "Interfax-Ukraine" },
  ];
  return mockData.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );
}

// Следим за параметром "q" в URL
watch(() => route.query.q, fetchResults, { immediate: true });
</script>
