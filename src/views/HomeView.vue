<template>
  <div class="home w-full">
    <Home msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Home } from "@/components";

export default defineComponent({
  name: "HomeView",
  components: {
    Home,
  },
});
</script>
