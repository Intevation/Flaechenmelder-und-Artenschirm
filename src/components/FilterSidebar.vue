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
  if (mapStore.artenschirmCluster) {
    toggleLayer(mapStore.artenschirmCluster)
  }
}

const toggleFlaechenmelder = () => {
  if (mapStore.flaechenmelderCluster) {
    toggleLayer(mapStore.flaechenmelderCluster)
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
        <h2>Artenschirm</h2>
        <label>
          <input checked type="checkbox" :onchange="toggleArtenschirm" />
          <span>Auf der Karte anzeigen</span>
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
        <FilterSearch
          @updatedFilters="
            (event) => {
              mapStore.setArtenFilter('arten', event)
            }
          "
          :activeFilters="mapStore.artenschirmFilters.arten"
          label="Nach Arten filtern:"
          :options="mapStore.artenschirmOptions"
          placeholder="Trivialer oder lateinischer Name"
        />
        <FilterSearch
          @updatedFilters="
            (event) => {
              mapStore.artenschirmBundeslandFilters = event
            }
          "
          :activeFilters="mapStore.artenschirmBundeslandFilters"
          label="Nach Bundesland filtern:"
          :options="mapStore.bundeslaender"
          placeholder="Bundesland"
        />
        <label>
          <input v-model="mapStore.artenschirmFilters.geplant" type="checkbox" />
          <span>Geplant</span>
        </label>
        <label>
          <input v-model="mapStore.artenschirmFilters.bestehend" type="checkbox" />
          <span>Bestehend</span>
        </label>
        <label>
          <input v-model="mapStore.artenschirmFilters.artenschirmArten" type="checkbox" />
          <span>Artenschirm-Arten</span>
        </label>
        <label>
          <input v-model="mapStore.artenschirmFilters.andereArten" type="checkbox" />
          <span>Andere Arten</span>
        </label>
      </div>
      <div v-if="mapStore.flaechenmelder" class="sidebar-section">
        <h2>Flächenmelder</h2>
        <label>
          <input checked type="checkbox" :onchange="toggleFlaechenmelder" />
          <span>Auf der Karte anzeigen</span>
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
