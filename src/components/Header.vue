<template>
  <header class="flex w-full items-center bg-[#111928]">
    <div class="container">
      <div class="relative -mx-4 flex items-center justify-between">
        <div class="w-60 max-w-full px-4">
          <router-link to="/home" class="block w-full py-1">
            <img
              src="../assets/graphics/images/logo.png"
              alt="logo"
              class="w-[75%]"
            />
          </router-link>
        </div>
        <div class="flex w-full items-center justify-between px-4">
          <div>
            <button
              @click="toggleNavbar"
              ref="dropdownButtonRef"
              id="navbarToggler"
              class="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
            >
              <span
                class="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"
              ></span>
              <span
                class="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"
              ></span>
              <span
                class="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"
              ></span>
            </button>
            <nav
              :class="{ hidden: !open }"
              id="navbarCollapse"
              class="absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow dark:bg-dark-2 lg:static lg:block lg:w-full lg:max-w-full lg:shadow-none lg:dark:bg-transparent"
            >
              <ul class="block lg:flex">
                <template v-for="(item, index) in navLinkItems" :key="index">
                  <li>
                    <router-link
                      :to="item.href"
                      class="flex py-2 text-base font-medium text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white lg:ml-12 lg:inline-flex"
                    >
                      {{ item.text }}
                    </router-link>
                  </li>
                </template>
              </ul>
            </nav>
          </div>
          <!-- <div class="hidden justify-end pr-16 sm:flex lg:pr-0">
            <a
              href="/#"
              class="px-7 py-3 text-base font-medium text-dark hover:text-primary dark:text-white"
              >Sign in</a
            >
            <a
              href="/#"
              class="rounded-md bg-primary px-7 py-3 text-base font-medium text-white hover:bg-primary/90"
              >Sign Up</a
            >
          </div> -->
        </div>
      </div>
    </div>
  </header>
</template>
<script setup>
import { ref } from "vue";
const open = ref(false);
const dropdownButtonRef = (ref < HTMLButtonElement) | (null > null);

const toggleNavbar = () => {
  open.value = !open.value;
};

const navLinkItems = ref([
  { text: "Home", href: "/" },
  { text: "Preview", href: "/preview" },
]);

// Custom composition function to handle click outside
// const handleClickOutside = (event) => {
//   if (
//     dropdownButtonRef.value &&
//     !dropdownButtonRef.value.contains(event.target)
//   ) {
//     open.value = false;
//   }
// };

// onMounted(() => {
//   document.addEventListener("click", handleClickOutside);
// });

// onUnmounted(() => {
//   document.removeEventListener("click", handleClickOutside);
// });
</script>
