<template>
  <div @keydown.esc="showModalKeycap = false">
    <div class="p-4 flex flex-col justify-between min-h-[80vh] mx-auto">
      <!-- Render Sections -->
      <div v-for="(section, index) in sections" :key="index" class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h1
            v-if="!section.editingTitle"
            @click="toggleEdit(index)"
            class="flex cursor-pointer text-2xl font-semibold text-white h-[42px] border-b-2 border-sky-500 w-96"
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
            class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-96"
          />
          <button
            @click="showModal(section.id)"
            v-if="index !== 2"
            class="font-medium rounded-lg text-sm px-5 py-2 text-center bg-blue-500 text-white hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4"
        >
          <div
            v-for="image in section.images"
            :key="image.id"
            class="h-28 w-28 bg-gray-200 flex items-center justify-center overflow-hidden rounded-lg shadow-md"
          >
            <img
              @click="handleEdit(image)"
              :src="image.url"
              alt="Image"
              class="max-h-full max-w-full"
            />
          </div>
        </div>
        <textarea
          v-if="index === 2"
          class="w-full h-40 p-2 border rounded-lg"
          placeholder="Enter text here..."
        ></textarea>
      </div>
      <!-- <button @click="updateDocument">Upload Data</button> -->
    </div>
    <ModalKeycap @save="onSave" />
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
import { sections, showModalKeycap, editingKeycap } from "@/services/sections";
const addingSection = ref(null);
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
const handleEdit = (keycap) => {
  showModalKeycap.value = true;
  editingKeycap.value = keycap;
};
// const data = ref([]);

const fetchData = async () => {
  try {
    const querySnapshot = await getDocs(
      collection(db, FIREBASE_CONFIG.collection)
    );
    const res = querySnapshot.docs.map((doc) => ({
      id: FIREBASE_CONFIG.doc_id,
      ...doc.data(),
    }));
    if (res[0].data) {
      sections.value = res[0].data;
    } else {
      sections.value = [];
    }
  } catch (error) {
    console.log(error);
  }
};

onBeforeMount(() => {
  fetchData();
});
const updateDocument = async (uploadData) => {
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
      data: uploadData,
    });
    console.log("Document updated with ID: ", FIREBASE_CONFIG.doc_id);
    fetchData();
  } catch (e) {
    console.error("Error updating document: ", e);
  }
};

const showModal = (sectionId) => {
  addingSection.value = sectionId;
  editingKeycap.value = {};
  showModalKeycap.value = true;
};

const onSave = (formData) => {
  const section = sections.value.find(
    (item) => item.id === addingSection.value
  );
  if (section && section.images) {
    section.images.push(formData);
  }
  const uploadData = sections.value;
  // console.log(sections.value);
  updateDocument(uploadData);
};
</script>

<style scoped>
/* Add any additional styles here if necessary */
</style>
