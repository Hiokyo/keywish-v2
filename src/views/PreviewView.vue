<template>
  <div class="preview w-full px-[100px] py-5">
    <Preview msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Preview } from "@/components";

export default defineComponent({
  name: "PreviewView",
  components: {
    Preview,
  },
});
</script>
