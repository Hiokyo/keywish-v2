import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import { createPinia } from "pinia";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "./index.css";
import { LoadingPlugin } from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

const app = createApp(App);
app.use(router);
app.use(LoadingPlugin);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(createPinia());
app.mount("#app");
