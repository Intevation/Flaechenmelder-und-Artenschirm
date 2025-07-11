<script setup lang="ts">
import { computed } from 'vue'
import { useMapStore } from '@/stores/map.ts'
import { X } from 'lucide-vue-next'

const mapStore = useMapStore()
const properties = computed(() => {
  return mapStore.selectedFeature?.properties
})

const displayArea = () => {
  if (properties.value.Groesse) {
    return `${properties.value.Groesse}`.replace('.', ',') + ' Hektar'
  } else if (properties.value.areaSizeInHa) {
    return `${properties.value.areaSizeInHa.toFixed(2)}`.replace('.', ',') + ' Hektar'
  }
  return ''
}
</script>

<template>
  <div id="popup" :class="{ open: mapStore.selectedFeature }">
    <div v-if="properties" id="popup-header">
      <h2>
        {{
          properties.Flaechenname
            ? properties.Flaechenname
            : properties.NameProjekt
              ? properties.NameProjekt
              : ''
        }}
      </h2>
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
    </div>
    <div v-if="properties" id="popup-content">
      <!-- Flächenmelder -->
      <div v-if="properties.Flaechenname">
        <div v-if="properties.Groesse || properties.areaSizeInHa">
          {{ displayArea() }}
        </div>
      </div>

      <!-- Artenschirm -->
      <template v-else-if="properties.NameProjekt">
        <div v-if="properties.PlanStartjahr.trim()">
          Geplantes Startjahr: {{ properties.PlanStartjahr }}
        </div>
        <div v-if="properties.Startjahr && properties.Endjahr">
          {{ properties.Startjahr }} - {{ properties.Endjahr }}
        </div>
        <div v-if="properties.Startjahr2">Seit {{ properties.Startjahr2 }}</div>
        <h3>Ziele</h3>
        <List :list="properties.projektziele" />
        <template v-if="properties.Arten?.length > 0">
          <h3>Profitierende Arten</h3>
          <h4>Artenschirm-Arten</h4>
          <div
            class="arten"
            v-for="(category, artenIndex) in properties.Arten"
            v-bind:key="`arten-${artenIndex}`"
          >
            <template v-if="properties.Arten?.length > 0">
              <div class="category-name">{{ Object.keys(category)[0] }}:</div>
              <div class="category">
                <div
                  v-for="(art, categoryIndex) in category[Object.keys(category)[0]]"
                  v-bind:key="`${category}-${categoryIndex}`"
                  class="art"
                >
                  {{ art }}
                </div>
              </div>
            </template>
          </div>
          <div v-if="properties.artensontiges.trim()">
            <h4>Sonstige Arten</h4>
            <div class="art">
              {{ properties.artensontiges }}
            </div>
          </div>
        </template>
        <div v-if="properties.Massnahmen">
          {{ properties.bestehendesProjekt === true ? 'Durchgeführte' : 'Geplante' }} Maßnahmen:
          {{ properties.Massnahmen }}
        </div>
        <a v-if="properties.linkProjekt" :href="properties.linkProjekt">{{
          properties.linkProjekt
        }}</a>
      </template>
      <div v-if="properties.Fotos?.length > 0">
        <ImageCarousel :imageLinks="properties.Fotos" />
      </div>
      <div v-if="properties.Engagementtyp">
        <span>Haupt- oder ehrenamtliche Leitung/Durchführung: </span>
        <span v-if="['ehrenamtlich', 'hauptamtlich'].includes(properties.Engagementtyp)">
          {{
            properties.Engagementtyp.charAt(0).toUpperCase() + properties.Engagementtyp.substring(1)
          }}
        </span>
        <span v-else-if="properties.Engagementtyp === 'HauptundEhrenamtlich'">
          Haupt- und ehrenamtlich
        </span>
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
      <div v-if="properties.hilfreich?.length > 0">
        Was für das Projekt hilfreich wäre:
        <List :list="properties.hilfreich" />
      </div>
      <div v-if="properties.voranbringen">
        Was das Projekt voranbringen würde:
        <List :list="properties.voranbringen" />
      </div>
      <div v-if="properties.Lebensraumtypen?.length > 0">
        Lebensraumtypen:
        <List :list="properties.Lebensraumtypen" />
      </div>
      Kontaktdaten der Ansprechperson für das Projekt:
      <div v-if="properties.VornameName">
        {{ properties.VornameName }}
      </div>
      <div v-if="properties.email">
        {{ properties.email }}
      </div>
    </div>
  </div>
</template>

<style scoped>
#popup {
  display: flex;
  position: absolute;
  bottom: 8pt;
  right: 0pt;
  z-index: 1001;
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
}

#popup:not(.open) * {
  display: none;
}

#popup-header {
  display: flex;
  justify-content: space-between;
}

#popup-content {
  overflow: auto;
}

.arten {
  display: flex;
  flex-direction: column;
}

.arten .category {
  display: flex;
  gap: 2pt;
}

.arten .category .category-name {
  display: flex;
  align-items: center;
}

.art {
  width: fit-content;
  background-color: #ddd;
  border-radius: 3pt;
  padding: 3pt 4pt;
  font-size: 10pt;
}

@media (max-width: 800px) {
  #popup.open {
    width: 100vw;
    max-width: 100vw;
    height: 100vh;
    max-height: 100vh;
    right: 0;
    bottom: 0;
  }
}
</style>
