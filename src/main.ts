import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import { createPinia } from "pinia";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "./index.css";

createApp(App)
  .use(router)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(createPinia())
  .mount("#app");
