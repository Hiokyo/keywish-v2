import { reactive, ref } from "vue";

export const showModalKeycap = ref(false);
export const editingKeycap = ref({});
export const activeSection = ref({
  id: null,
});

export const sections = ref([
  {
    id: 1,
    title: "Section 1 Title",
    editingTitle: false,
    images: [],
  },
  {
    id: 2,
    title: "Section 2 Title",
    editingTitle: false,
    images: [],
  },
  {
    id: 3,
    title: "Section 3 Title",
    editingTitle: false,
    note: "",
  },
]);
