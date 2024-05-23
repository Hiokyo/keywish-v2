<template>
  <div
    class="fixed left-0 top-0 flex z-50 h-full min-h-screen w-full items-center justify-center bg-dark/90 px-4 py-5"
    :class="{ block: showModalKeycap, hidden: !showModalKeycap }"
  >
    <div
      ref="modalContainer"
      class="bg-main w-full max-w-3xl p-8 rounded-lg shadow-md"
    >
      <div class="max-h-[70vh] overflow-x-hidden overflow-y-auto px-2">
        <form class="mt-4">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-white"
              >Name</label
            >
            <input
              type="text"
              class="mt-1 p-2 w-full border rounded-md"
              id="name"
            />
          </div>
          <div class="mb-4">
            <label for="fileUrl" class="block text-sm font-medium text-white"
              >Image Link</label
            >
            <input
              type="text"
              class="mt-1 p-2 w-full border rounded-md"
              id="fileUrl"
              ref="file"
              aria-describedby="fileUrlHelp"
            />
          </div>
          <div class="mb-4">
            <label for="fileInput" class="block text-sm font-medium text-white"
              >Upload Image</label
            >
            <input
              type="file"
              ref="file"
              id="fileInput"
              @change="loadImage($event)"
              accept="image/*"
            />
          </div>
          <div class="mb-4">
            <div class="cropArea">
              <cropper
                :src="image.src"
                ref="cropper"
                :debounce="false"
                :stencil-props="{
                  aspectRatio: 1,
                }"
                @change="handleCropImage"
              />
            </div>
          </div>
          <div class="mb-4">
            <preview
              :width="240"
              :height="240"
              :image="result.image"
              :coordinates="result.coordinates"
            />
          </div>
        </form>
      </div>
      <div class="flex justify-end mt-6">
        <button
          class="text-white bg-[#3266e3] hover:bg-[#2557D6]/90 focus:ring-4 focus:ring-[#2557D6]/50 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#2557D6]/50 me-2"
        >
          Create
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
import { showModalKeycap } from "@/services/sections";
import { Cropper, Preview } from "vue-advanced-cropper";
import { reactive, ref } from "vue";
import "vue-advanced-cropper/dist/style.css";

let result = reactive({
  coordinates: null,
  image: null,
});

const image = ref({
  src: null,
  type: null,
});

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
  // Reference to the DOM input element
  const { files } = event.target;
  // Ensure that you have a file before attempting to read it
  if (files && files[0]) {
    // 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
    if (image.value.src) {
      URL.revokeObjectURL(image.value.src);
    }
    // 2. Create the blob link to the file to optimize performance:
    const blob = URL.createObjectURL(files[0]);

    // 3. The steps below are designated to determine a file mime type to use it during the
    // getting of a cropped image from the canvas. You can replace it them by the following string,
    // but the type will be derived from the extension and it can lead to an incorrect result:
    //
    // this.image = {
    //    src: blob;
    //    type: files[0].type
    // }

    // Create a new FileReader to read this image binary data
    const reader = new FileReader();
    // Define a callback function to run, when FileReader finishes its job
    reader.onload = (e) => {
      // Note: arrow function used here, so that "this.image" refers to the image of Vue component

      image.value.src = blob;
      image.value.type = getMimeType(e.target.result, files[0].type);
    };
    // Start the reader job - read file as a data url (base64 format)
    reader.readAsArrayBuffer(files[0]);
  }
};
const handleCropImage = ({ coordinates, image }) => {
  result = { coordinates, image };
  console.log(result);
};

// const handleClickOutside = (event: MouseEvent): void => {
//   if (
//     modalContainer.value &&
//     trigger.value &&
//     !modalContainer.value.contains(event.target as Node) &&
//     event.target !== trigger.value
//   ) {
//     setModalOpen(false);
//   }
// };
</script>

<style lang="scss" scoped>
.cropArea {
  background: #e4e4e4;
  overflow: hidden;
  width: 678px;
  height: 360px;
}
</style>
