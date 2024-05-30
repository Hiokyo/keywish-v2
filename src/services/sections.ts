import { reactive, ref } from "vue";
import { db, FIREBASE_CONFIG } from "@/helpers/firebase";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { useLoading } from "vue-loading-overlay";

const $loading = useLoading({
  isFullPage: true,
  loader: "dots",
  backgroundColor: "#848c8b",
  opacity: 0.3,
});

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

export const fetchData = async () => {
  const loader = $loading.show({
    // Optional parameters
  });
  try {
    const querySnapshot = await getDocs(
      collection(db, FIREBASE_CONFIG.collection)
    );
    const res = querySnapshot.docs.map((doc) => ({
      id: FIREBASE_CONFIG.doc_id,
      ...doc.data(),
    }));
    if (res[0].data) {
      sections.value = res[0].data;
    } else {
      sections.value = [];
    }
  } catch (error) {
    console.log(error);
  } finally {
    loader.hide();
  }
};
