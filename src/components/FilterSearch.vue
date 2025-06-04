<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import { X } from 'lucide-vue-next'
import { useMapStore } from '@/stores/map.ts'

const mapStore = useMapStore()
const props = defineProps<{
  options: Array<string>
  includedFields?: Array<string>
  placeholder?: string
}>()

const showSuggestions = ref(false)
const isListBoxHovered = ref(false)
const focusedSuggestionIndex = ref(-1)
const inputValue = ref('')
const suggestions = computed<Array<string>>(() => {
  if (showSuggestions.value === false) return []
  if (inputValue.value === '') return []
  return props.options.filter((opt: string) => {
    return (
      opt.toLowerCase().includes(inputValue.value.toLowerCase()) &&
      !mapStore.artenFilters.includes(opt)
    )
  })
})

const onClick = () => {
  showSuggestions.value = true
}

const onKeyDown = (event: any) => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
  }
  if (event.key === 'ArrowDown') {
    if (focusedSuggestionIndex.value < props.options.length - 1) {
      focusedSuggestionIndex.value = focusedSuggestionIndex.value + 1
    } else {
      focusedSuggestionIndex.value = -1
    }
  } else if (event.key === 'ArrowUp') {
    if (focusedSuggestionIndex.value > -1) {
      focusedSuggestionIndex.value = focusedSuggestionIndex.value - 1
    } else {
      focusedSuggestionIndex.value = props.options.length - 1
    }
  } else if (event.key === 'Enter') {
    if (focusedSuggestionIndex.value === -1) {
      applyFilters()
    } else {
      selectSuggestion(focusedSuggestionIndex.value)
    }
  }
  if (event.key !== 'Enter' && event.key !== 'Escape') {
    showSuggestions.value = true
  }
  if (event.key === 'Escape') {
    if (showSuggestions.value === true) {
      showSuggestions.value = false
    } else {
      resetInput()
    }
  }
}

const resetInput = () => {
  inputValue.value = ''
}

const applyFilters = () => {
  mapStore.applyFilters()
}

const selectSuggestion = (index: number) => {
  mapStore.artenFilters.push(suggestions.value[index])
  resetInput()
  focusedSuggestionIndex.value = -1
  applyFilters()
}

const removeFilter = (index: number) => {
  mapStore.artenFilters.splice(index, 1)
  applyFilters()
}
</script>

<template>
  <div id="filter-search">
    <div id="active-filters">
      <div
        v-for="(filter, index) in mapStore.artenFilters"
        v-bind:key="`filter-${filter}`"
        class="filter"
      >
        <span>{{ filter }}</span>
        <button
          :title="`Filter entfernen: ${filter}`"
          :onclick="
            () => {
              removeFilter(index)
            }
          "
        >
          <X aria-hidden="true" :size="16" />
        </button>
      </div>
    </div>
    <div class="combobox-container">
      <label for="searchbar-input">Nach Arten filtern:</label>
      <div
        :class="`combobox ${showSuggestions ? 'open' : ''} ${showSuggestions && focusedSuggestionIndex === -1 ? 'focused' : ''}`"
      >
        <input
          id="searchbar-input"
          placeholder="Trivialer oder lateinischer Name"
          type="text"
          role="combobox"
          v-model="inputValue"
          :aria-activedescendant="
            focusedSuggestionIndex !== -1 ? options[focusedSuggestionIndex] : ''
          "
          aria-autocomplete="list"
          aria-expanded="false"
          aria-controls="search-listbox"
          :onblur="
            () => {
              if (!isListBoxHovered) {
                showSuggestions = false
              }
            }
          "
          :onclick="onClick"
          :onfocus="
            () => {
              showSuggestions = true
            }
          "
          :onkeydown="onKeyDown"
        />
        <button
          v-if="inputValue?.length > 0"
          id="reset-search-button"
          tabIndex="-1"
          aria-label="Reset search"
          aria-expanded="false"
          aria-controls="search-listbox"
          :onclick="resetInput"
        >
          <X :size="16" />
        </button>
        <ul
          :onmouseenter="
            () => {
              isListBoxHovered = true
            }
          "
          :onmouseleave="
            () => {
              isListBoxHovered = false
            }
          "
          id="search-listbox"
          role="listbox"
          aria-label="Suggestions"
        >
          <template v-if="showSuggestions">
            <li
              v-for="(suggestion, index) of suggestions"
              v-bind:key="index"
              :class="`${index === focusedSuggestionIndex ? 'focused' : ''}`"
              :onclick="
                () => {
                  selectSuggestion(index)
                }
              "
              :id="suggestion"
              role="option"
            >
              {{ suggestion }}
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
#filter-search {
  display: flex;
  flex-direction: column;
  gap: 5pt;
}

#active-filters {
  display: flex;
  flex-direction: column;
  gap: 2pt;
}

.filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2pt;
  padding: 3pt;
  background-color: #ececec;
  border-radius: 2pt;
}

.filter button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1pt;
  border: none;
  border-radius: 4pt;
  background-color: #a85252;
  color: white;
  min-height: 25px;
  min-width: 25px;
}

.filter button:hover {
  background-color: #914e4e;
}

.filter span {
  font-size: 11pt;
}

.combobox-container {
  display: flex;
  flex-direction: column;
  gap: 2pt;
  height: 100%;
}

.combobox {
  display: flex;
  align-items: stretch;
  position: relative;
  border: 1pt solid black;
  border-radius: 3pt;
  width: 100%;
}

.combobox.focused {
  outline: 2pt solid var(--highlight);
}

.combobox.open ul[role='listbox'] {
  display: block;
}

.combobox input {
  flex-grow: 2;
  height: 26pt;
  min-width: 0;
  border: none;
  outline: none;
  background-color: transparent;
}

.combobox button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
}

#reset-search-button {
  color: var(--accent-dark);
}

#search-button {
  background-color: var(--accent);
  color: white;
}

#search-button:hover {
  background-color: var(--accent-dark);
  color: white;
}

[role='listbox'].focus [role='option'][aria-selected='true'],
[role='listbox'] [role='option']:hover {
  background-color: #eed;
}

ul[role='listbox'] {
  margin: 0;
  padding: 0;
  position: absolute;
  z-index: 1009;
  left: 0;
  top: 26pt;
  list-style: none;
  background-color: white;
  display: none;
  box-sizing: border-box;
  border: 1px #333 solid;
  max-height: 250px;
  width: 100%;
  overflow: scroll;
  overflow-x: hidden;
  cursor: pointer;
}

ul[role='listbox'] li[role='option'] {
  margin: 0;
  display: block;
  min-height: 22pt;
  padding: 2pt 4pt;
}

ul[role='listbox'] li[role='option'].focused {
  color: white;
  background-color: var(--highlight);
}
</style>
