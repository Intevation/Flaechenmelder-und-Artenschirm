<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import { ChevronLeft } from 'lucide-vue-next'

const isSidebarOpen: Ref<boolean> = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div id="sidebar-container" :class="{ open: isSidebarOpen }">
    <aside id="sidebar">
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
  gap: 2pt;
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
  margin-top: 20pt;
  border: none;
  background-color: white;
  border-top-right-radius: 2pt;
  border-bottom-right-radius: 2pt;
  cursor: pointer;
}
#sidebar-container #toggle-sidebar div.rotated {
  transform: rotate(180deg);
}
</style>
