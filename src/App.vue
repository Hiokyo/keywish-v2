<template>
  <Header />
  <div class="flex flex-col items-center overflow-auto">
    <!-- <Burger class="burger" /> -->
    <!-- <div class="my-2 font-bold">This burger menu icon is SVG component.</div> -->
    <Suspense>
      <router-view />
    </Suspense>
  </div>
</template>

<script setup>
import { Header } from "@/components";
import { onBeforeMount } from "vue";
import { fetchData } from "./services/sections";

onBeforeMount(() => {
  fetchData();
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  height: 100vh;
  background-image: url(./assets/graphics/images/back-ground.png);
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.burger {
  height: 50px;
  widows: auto;
  fill: black;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
