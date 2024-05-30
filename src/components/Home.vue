<template>
  <div @keydown.esc="showModalKeycap = false">
    <div class="p-4 flex flex-col justify-between h-[80vh] mx-auto">
      <!-- Render Sections -->
      <div v-for="(section, index) in sections" :key="index" class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h1
            v-if="!section.editingTitle"
            @click="toggleEdit(index)"
            class="flex font-semi-bold cursor-pointer items-center justify-start me-6 w-96 truncate text-2xl min-h-[42px] border-b-2 border-fuchsia-300 bg-gradient-to-r from-sky-600 via-violet-500 to-sky-400 text-transparent bg-clip-text"
          >
            {{ section.title.length ? section.title : "Section name here..." }}
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
          class="grid grid-cols-3 lg:grid-cols-7 md:grid-cols-5 gap-4 py-4 max-w-fit"
        >
          <div
            v-for="image in section.images"
            :key="image.id"
            class="col-md-3 mb-3 max-w-fit"
          >
            <div class="h-full flex flex-col max-w-fit">
              <div class="relative max-w-fit">
                <button
                  class="absolute top-2 right-2 inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-md group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
                  @click="handleRemoveImage(section.id, image.id)"
                >
                  <span
                    class="p-1 transition-all ease-in duration-75 bg-white dark:bg-gray-600 rounded-md group-hover:bg-opacity-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-4 h-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </span>
                </button>
                <img
                  @click="handleEdit(image)"
                  :src="image.url"
                  alt="Image"
                  class="h-auto max-w-full rounded-lg cursor-pointer"
                />
              </div>
              <div>
                <h5 class="text-center text-xl text-purple-50">
                  {{ image.name }}
                </h5>
              </div>
            </div>
          </div>
        </div>
        <div v-if="section.id === 3" class="w-full">
          <div class="w-[45%]">
            <label
              for="floatingTextarea"
              class="flex mb-2 text-lg font-medium text-gray-900 dark:text-white"
              >Your note</label
            >
            <textarea
              id="floatingTextarea"
              rows="4"
              class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write your note here..."
              v-model="section.note"
            >
            </textarea>
          </div>
        </div>
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
import { useLoading } from "vue-loading-overlay";

const $loading = useLoading({
  isFullPage: true,
  loader: "dots",
  backgroundColor: "#848c8b",
  opacity: 0.3,
});

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

const handleRemoveImage = (sectionId, imageId) => {
  const section = sections.value.find((item) => item.id === sectionId);
  const newImagesArr = section.images.filter((img) => img.id !== imageId);
  if (section && newImagesArr) {
    section.images = newImagesArr;
  }
  const uploadData = sections.value;
  // console.log(sections.value);
  updateDocument(uploadData);
};
// const data = ref([]);

const updateDocument = async (uploadData) => {
  if (!FIREBASE_CONFIG.doc_id) {
    console.error("No document ID available to update.");
    return;
  }
  const loader = $loading.show({
    // Optional parameters
  });
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
    loader.hide();
  } catch (e) {
    loader.hide();
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
