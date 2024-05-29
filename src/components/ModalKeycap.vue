<template>
  <div
    class="fixed left-0 top-0 flex z-50 h-full min-h-screen w-full items-center justify-center bg-dark/90 px-4 py-5"
    :class="{ block: showModalKeycap, hidden: !showModalKeycap }"
  >
    <div
      ref="modalContainer"
      class="bg-main w-full max-w-5xl p-8 rounded-lg shadow-md"
    >
      <div class="max-h-[75vh] overflow-x-hidden overflow-y-auto px-2">
        <form class="mt-4">
          <div class="mb-4">
            <label for="name" class="flex text-sm font-medium text-white ms-2"
              >Name</label
            >
            <input
              v-model="formData.name"
              type="text"
              class="mt-1 p-2 w-full border rounded-md"
              id="name"
            />
          </div>
          <div class="mb-4">
            <label
              for="fileUrl"
              class="flex text-sm font-medium text-white ms-2"
              >Image Link</label
            >
            <input
              v-model="formData.link"
              type="text"
              class="mt-1 p-2 w-full border rounded-md"
              id="fileUrl"
              ref="file"
              aria-describedby="fileUrlHelp"
            />
          </div>
          <div class="mb-4">
            <label
              for="fileInput"
              class="flex text-sm font-medium text-white ms-2"
              >Upload Image</label
            >
            <input
              class="mt-1 p-2 w-full border rounded-md text-white"
              type="file"
              ref="fileInput"
              id="fileInput"
              @change="loadImage($event)"
              accept="image/*"
            />
          </div>
        </form>
        <div class="mb-4 flex">
          <div class="cropArea w-[70%]">
            <cropper
              :src="image.src"
              ref="cropperRef"
              :debounce="false"
              :stencil-props="{
                aspectRatio: 1,
              }"
              @change="handleCropImage"
            />
          </div>
          <div class="flex w-[30%] justify-center items-center bg-[#e4e4e4]">
            <preview
              :width="240"
              :height="240"
              :image="result.image"
              :coordinates="result?.coordinates"
            />
          </div>
        </div>
      </div>
      <div class="flex justify-end mt-6">
        <button
          class="text-white bg-[#3266e3] hover:bg-[#2557D6]/90 focus:ring-4 focus:ring-[#2557D6]/50 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#2557D6]/50 me-2"
          @click="handleSave"
        >
          {{ editingKeycap.id ? "Save" : "Create" }}
        </button>
        <button
          @click="setModalOpen(false)"
          class="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { editingKeycap, showModalKeycap } from "@/services/sections";
import { Cropper, Preview } from "vue-advanced-cropper";
import { ref, defineEmits, reactive, watch } from "vue";
import "vue-advanced-cropper/dist/style.css";
import { generateID } from "@/helpers/utils";
const emits = defineEmits(["save"]);
const cropperRef = ref(null);
const fileInput = ref(null);
const result = ref({
  coordinates: null,
  image: null,
});

const image = ref({
  src: null,
  type: null,
});

let formData = reactive({
  name: "",
  url: "",
  link: "",
});

watch(
  () => editingKeycap.value,
  (value) => {
    if (value.id) {
      formData = value;
    }
  }
);

const reset = () => {
  formData = {
    id: "",
    name: "",
    url: "",
    link: "",
  };
  image.value.src = "";
  image.value.type = "";
  fileInput.value.value = "";
  result.value.coordinates = {};
  result.value.image = {};
};
const setModalOpen = (value) => {
  showModalKeycap.value = value;
};

const getMimeType = (file, fallback = null) => {
  const byteArray = new Uint8Array(file).subarray(0, 4);
  let header = "";
  for (let i = 0; i < byteArray.length; i++) {
    header += byteArray[i].toString(16);
  }
  switch (header) {
    case "89504e47":
      return "image/png";
    case "47494638":
      return "image/gif";
    case "ffd8ffe0":
    case "ffd8ffe1":
    case "ffd8ffe2":
    case "ffd8ffe3":
    case "ffd8ffe8":
      return "image/jpeg";
    default:
      return fallback;
  }
};

const loadImage = (event) => {
  const { files } = event.target;

  if (files && files[0]) {
    if (image.value.src) {
      URL.revokeObjectURL(image.value.src);
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const mimeType = getMimeType(arrayBuffer, files[0].type);

      // Convert the ArrayBuffer to base64 string
      const base64String = arrayBufferToBase64(arrayBuffer);

      // Set the image src to the base64 string
      image.value.src = `data:${mimeType};base64,${base64String}`;
      image.value.type = mimeType;
    };

    reader.readAsArrayBuffer(files[0]);
  }
};

const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};
const handleCropImage = ({ coordinates, image }) => {
  result.value.coordinates = coordinates;
  result.value.image = image;
};

const handleSave = () => {
  if (!editingKeycap.value) {
    formData.id = generateID();
  }
  const { canvas } = cropperRef.value.getResult();
  formData.url = canvas.toDataURL("image/jpeg", 0.8);
  showModalKeycap.value = false;
  emits("save", formData);
  reset();
};
</script>

<style lang="scss" scoped>
.cropArea {
  background: #e4e4e4;
  overflow: hidden;
  width: 678px;
  height: auto;
}
</style>
