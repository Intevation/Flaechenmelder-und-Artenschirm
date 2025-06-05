<script setup lang="ts">
import { computed } from 'vue'
import { useMapStore } from '@/stores/map.ts'
import { X } from 'lucide-vue-next'

const mapStore = useMapStore()
const properties = computed(() => {
  return mapStore.selectedFeature?.properties
})
</script>

<template>
  <div id="popup" :class="{ open: mapStore.selectedFeature }">
    <button
      id="close-popup"
      :onclick="
        () => {
          mapStore.selectedFeature = undefined
        }
      "
    >
      <X />
    </button>
    <template v-if="properties">
      <!-- Flächenmelder -->
      <div v-if="properties.Flaechenname">
        <h2>{{ properties.Flaechenname }}</h2>
        <small>{{ properties.Flaechenname }}</small>
      </div>

      <!-- Artenschirm -->
      <template v-else-if="properties.NameProjekt">
        <h2>{{ properties.NameProjekt }}</h2>
        <div>Ziele: {{ properties.projektziele.join(', ') }}</div>
        <template v-if="properties.Arten?.length > 0">
          <span>Profitierende Arten:</span>
          <div
            class="arten"
            v-for="(category, artenIndex) in properties.Arten"
            v-bind:key="`arten-${artenIndex}`"
          >
            <div class="category">
              <div class="category-name">{{ Object.keys(category)[0] }}:</div>
              <div
                v-for="(art, categoryIndex) in category[Object.keys(category)[0]]"
                v-bind:key="`${category}-${categoryIndex}`"
                class="art"
              >
                {{ art }}
              </div>
            </div>
          </div>
        </template>
        <div v-if="properties.PlanStartjahr.trim()">
          Geplantes Startjahr: {{ properties.PlanStartjahr }}
        </div>
        <div v-if="properties.Startjahr && properties.Endjahr">
          Zeitraum: {{ properties.Startjahr }} - {{ properties.Endjahr }}
        </div>
        <div v-if="properties.Massnahmen">
          {{ properties.bestehendesProjekt === true ? 'Durchgeführte' : 'Geplante' }} Maßnahmen:
          {{ properties.Massnahmen }}
        </div>
        <a v-if="properties.linkProjekt" :href="properties.linkProjekt">{{
          properties.linkProjekt
        }}</a>
      </template>
      <div v-if="properties.Fotos">
        <img v-for="(foto, index) in properties.Fotos" v-bind:key="index" :src="foto" />
      </div>
      <div v-if="properties.Kooperation">Kooperationspartner: {{ properties.Kooperation }}</div>
      <div v-if="properties.Erfolgsmessung">
        Dokumentation des Projekterfolgs/-fortschritts: {{ properties.Erfolgsmessung }}
      </div>
      <div v-if="properties.Herausforderungen">
        Herausforderungen: {{ properties.Herausforderungen }}
      </div>
      <div v-if="properties.HerausforderungAktuell">
        Mögliche Herausforderungen: {{ properties.HerausforderungAktuell }}
      </div>
      <div v-if="properties.hilfreich">
        Was für das Projekt hilfreich wäre: {{ properties.hilfreich }}
      </div>
      <div v-if="properties.voranbringen">
        Was das Projekt voranbringen würde: {{ properties.voranbringen }}
      </div>
      <div v-if="properties.Lebensraumtypen">Lebensraumtyp: {{ properties.Lebensraumtypen }}</div>
      Kontaktdaten der Ansprechperson für das Projekt:
      <div v-if="properties.VornameName">
        {{ properties.VornameName }}
      </div>
      <div v-if="properties.email">
        {{ properties.email }}
      </div>
    </template>
  </div>
</template>

<style scoped>
#popup {
  display: flex;
  position: absolute;
  bottom: 8pt;
  right: 0pt;
  z-index: 1000;
  flex-direction: column;
  gap: 4pt;
  padding: 0pt;
  width: 0pt;
  background-color: white;
  border-radius: 4pt;
  overflow: hidden;
  transition: width 0.1s linear;
}
#popup.open {
  width: fit-content;
  max-width: 400pt;
  max-height: 98vh;
  right: 8pt;
  padding: 6pt;
  overflow: auto;
}

#popup:not(.open) * {
  display: none;
}

#close-popup {
  width: fit-content;
}

.arten {
  display: flex;
}

.arten .category {
  display: flex;
  gap: 2pt;
}

.arten .category .category-name {
  display: flex;
  align-items: center;
}

.arten .category .art {
  background-color: #ddd;
  border-radius: 3pt;
  padding: 2pt;
  font-size: 10pt;
}
</style>
