<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Layer } from 'leaflet'
import { ChevronLeft } from 'lucide-vue-next'
import { useMapStore } from '@/stores/map.ts'

const mapStore = useMapStore()
const isSidebarOpen: Ref<boolean> = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const toggleArtenschirm = () => {
  if (mapStore.artenschirm) {
    toggleLayer(mapStore.artenschirm)
  }
}

const toggleFlaechenmelder = () => {
  if (mapStore.flaechenmelder) {
    toggleLayer(mapStore.flaechenmelder)
  }
}

const toggleLayer = (layer: Layer) => {
  if (mapStore.map?.hasLayer(layer)) {
    mapStore.map.removeLayer(layer)
  } else {
    mapStore.map?.addLayer(layer)
  }
}
</script>

<template>
  <div id="sidebar-container" :class="{ open: isSidebarOpen }">
    <aside id="sidebar">
      <div v-if="mapStore.artenschirm" class="sidebar-section">
        <label>
          <input checked type="checkbox" :onchange="toggleArtenschirm" />
          <span>Artenschirm aktiv</span>
          <span
            style="
              display: inline-block;
              background-color: #051d2e;
              width: 10px;
              height: 10px;
              border-radius: 100%;
              margin: 0 2pt;
            "
          ></span>
        </label>
        <input type="text" placeholder="Arten suchen..." />
        <label>
          <input type="checkbox" />
          <span>Filter 1</span>
        </label>
        <label>
          <input type="checkbox" />
          <span>Filter 2</span>
        </label>
        <label>
          <input type="checkbox" />
          <span>Filter 3</span>
        </label>
      </div>
      <div v-if="mapStore.flaechenmelder" class="sidebar-section">
        <label>
          <input checked type="checkbox" :onchange="toggleFlaechenmelder" />
          <span>Flächenmelder aktiv</span>
          <span
            style="
              display: inline-block;
              background-color: #e18432;
              width: 10px;
              height: 10px;
              border-radius: 100%;
              margin: 0 2pt;
            "
          ></span>
        </label>
      </div>
    </aside>
    <button id="toggle-sidebar" :onclick="toggleSidebar">
      <div :class="{ rotated: !isSidebarOpen }">
        <ChevronLeft />
      </div>
    </button>
  </div>
</template>

<style scoped>
#sidebar-container {
  display: flex;
  position: absolute;
  top: 8pt;
  left: 0pt;
  height: calc(100% - 16pt);
  z-index: 1000;
}
#sidebar-container.open {
  left: 8pt;
}

#sidebar {
  display: flex;
  flex-direction: column;
  gap: 4pt;
  padding: 0pt;
  width: 0pt;
  background-color: white;
  border-radius: 4pt;
  overflow: hidden;
  transition: width 0.1s linear;
}
#sidebar-container:not(.open) #sidebar * {
  display: none;
}
#sidebar-container.open #sidebar {
  width: 200pt;
  padding: 6pt;
  overflow: reverse;
}

#toggle-sidebar {
  height: 26pt;
  width: 24pt;
  margin-top: 20pt;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-left: none;
  background-clip: padding-box;
  background-color: white;
  border-top-right-radius: 2pt;
  border-bottom-right-radius: 2pt;
  cursor: pointer;
}
#toggle-sidebar:hover {
  background-color: #f4f4f4;
}
#sidebar-container #toggle-sidebar div {
  display: flex;
  justify-content: center;
}
#sidebar-container #toggle-sidebar div.rotated {
  transform: rotate(180deg);
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 2pt;
}
</style>
