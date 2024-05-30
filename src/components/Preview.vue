<template>
  <div>
    <div class="card">
      <div class="content">
        <div class="back">
          <div class="back-content">
            <div ref="gridContainer" class="preview-container">
              <div
                v-for="(section, index) in sectionData"
                :key="index"
                class="section-container"
              >
                <div v-if="section.images?.length > 0">
                  <h2 class="section-title">
                    {{ section.title }}
                  </h2>
                  <div class="grid-container">
                    <div
                      v-for="image in section.images"
                      :key="image.id"
                      class="grid-item"
                    >
                      <img :src="image.url" :alt="image.name" />
                      <p>{{ image.name }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button @click="exportToPNG">Export to PNG</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, nextTick, computed } from "vue";
import { sections, showModalKeycap, editingKeycap } from "@/services/sections";
import logo from "@/assets/graphics/images/back-ground.png";
import html2canvas from "html2canvas";
const gridContainer = ref(null);
const exportToPNG = async () => {
  try {
    const container = gridContainer.value; // Lấy giá trị của ref
    const canvas = await html2canvas(container, {
      backgroundColor: logo,
      scale: 4,
    });
    const pngData = canvas.toDataURL("image/png");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngData;
    downloadLink.download = "exported_image.png";
    downloadLink.click();
  } catch (error) {
    console.error("Error exporting to PNG:", error);
  }
};
const sectionData = computed(() => sections.value);
</script>

<style scoped lang="scss">
.preview-container {
  width: 90%;
  height: 90%;
}
.section-container {
  margin-bottom: 20px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.grid-item {
  text-align: center;
  width: 120px;
  height: auto;
}

.section-title {
  display: flex;
  margin-bottom: 1.5rem;
  color: #89b4ff;
  font-size: 30px;
}

.grid-item img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

.card {
  overflow: visible;
  width: 100%;
  height: 80vh;
}

.content {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 300ms;
  box-shadow: 0px 0px 10px 1px white;
  border-radius: 5px;
}

.back {
  background-color: #151515;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 5px;
  overflow: hidden;
}

.back {
  width: 100%;
  height: 100%;
  justify-content: center;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.back::before {
  position: absolute;
  content: " ";
  display: block;
  width: 160px;
  height: 160%;
  background: linear-gradient(
    90deg,
    transparent,
    #ff9966,
    #ff9966,
    #ff9966,
    #ff9966,
    transparent
  );
  animation: rotation_481 5000ms infinite linear;
}

.back-content {
  position: absolute;
  width: 99%;
  height: 99%;
  background-image: url(../assets/graphics/images/back-ground.png);
  border-radius: 5px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

@keyframes rotation_481 {
  0% {
    transform: rotateZ(0deg);
  }

  0% {
    transform: rotateZ(360deg);
  }
}

.description {
  box-shadow: 0px 0px 10px 5px #00000088;
  width: 100%;
  padding: 10px;
  background-color: #00000099;
  backdrop-filter: blur(5px);
  border-radius: 5px;
}

.title {
  font-size: 11px;
  max-width: 100%;
  display: flex;
  justify-content: space-between;
}

.title p {
  width: 50%;
}

.card-footer {
  color: #ffffff88;
  margin-top: 5px;
  font-size: 8px;
}

.front .img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.circle {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #ffbb66;
  position: relative;
  filter: blur(15px);
  animation: floating 2600ms infinite linear;
}

#bottom {
  background-color: #ff8866;
  left: 50px;
  top: 0px;
  width: 150px;
  height: 150px;
  animation-delay: -800ms;
}

#right {
  background-color: #ff2233;
  left: 160px;
  top: -80px;
  width: 30px;
  height: 30px;
  animation-delay: -1800ms;
}

@keyframes floating {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(10px);
  }

  100% {
    transform: translateY(0px);
  }
}
</style>
