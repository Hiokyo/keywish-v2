<template>
  <div>
    <div class="p-4 flex flex-col justify-between min-h-[80vh] mx-auto">
      <!-- Render Sections -->
      <div v-for="(section, index) in sections" :key="index" class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h1
            v-if="!section.editingTitle"
            @click="toggleEdit(index)"
            class="cursor-pointer text-2xl font-semibold text-white"
          >
            {{ section.title }}
          </h1>
          <input
            v-else
            v-model="section.title"
            type="text"
            :id="`section-${index}`"
            @keypress="handleKeyUp($event, index)"
            @blur="toggleEdit(index)"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <button
            @click="addImage(index)"
            v-if="index !== 2"
            class="ml-4 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4"
        >
          <div
            v-for="(image, imageIndex) in section.images"
            :key="imageIndex"
            class="h-28 w-28 bg-gray-200 flex items-center justify-center overflow-hidden rounded-lg shadow-md"
          >
            <img :src="image" alt="Image" class="max-h-full max-w-full" />
          </div>
        </div>
        <textarea
          v-if="index === 2"
          class="w-full h-40 p-2 border rounded-lg"
          placeholder="Enter text here..."
        ></textarea>
      </div>
      <button @click="updateDocument">Upload Data</button>
    </div>
    <ModalKeycap />
  </div>
</template>

<script setup>
import { ref, nextTick, onBeforeMount, watch } from "vue";
import { db, FIREBASE_CONFIG } from "@/helpers/firebase";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { ModalKeycap } from "@/components";
import { sections, showModalKeycap } from "@/services/sections";
const addingSection = ref("");

const toggleEdit = async (index, type) => {
  const section = sections.value[index];
  section.editingTitle = !section.editingTitle;
  if (section.editingTitle) {
    await nextTick();
    const inputElement = document.getElementById(`section-${index}`);
    if (inputElement) {
      inputElement.focus();
    }
  }
};

const handleKeyUp = (event, index) => {
  if (event.key === "Enter") {
    const section = sections.value[index];
    section.editingTitle = false;
  }
};

const data = ref([]);

const fetchData = async () => {
  const querySnapshot = await getDocs(
    collection(db, FIREBASE_CONFIG.collection)
  );
  data.value = querySnapshot.docs.map((doc) => ({
    id: FIREBASE_CONFIG.doc_id,
    ...doc.data(),
  }));
};

onBeforeMount(() => {
  fetchData();
});
watch(
  () => data.value,
  (value) => {
    console.log(value);
  }
);
const updateDocument = async () => {
  if (!FIREBASE_CONFIG.doc_id) {
    console.error("No document ID available to update.");
    return;
  }

  try {
    const documentRef = doc(
      db,
      FIREBASE_CONFIG.collection,
      FIREBASE_CONFIG.doc_id
    );
    await updateDoc(documentRef, {
      data: sections.value,
    });
    console.log("Document updated with ID: ", FIREBASE_CONFIG.doc_id);
  } catch (e) {
    console.error("Error updating document: ", e);
  }
};

const addImage = (index) => {
  // const url = prompt("Enter image URL");
  // if (url) {
  //   const section = sections.value[index];
  //   if (section && section.images) {
  //     section.images.push(url);
  //   }
  // }
  showModalKeycap.value = true;
};
</script>

<style scoped>
/* Add any additional styles here if necessary */
</style>
