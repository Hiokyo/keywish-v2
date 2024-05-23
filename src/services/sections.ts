import { reactive, ref } from "vue";

export const showModalKeycap = ref(false);

export const activeSection = ref({
  id: null,
});

export const sections = ref([
  {
    title: "Section 1 Title",
    editingTitle: false,
    images: [],
  },
  {
    title: "Section 2 Title",
    editingTitle: false,
    images: [],
  },
  {
    title: "Section 3 Title",
    editingTitle: false,
    note: "",
  },
]);
