<script setup lang="ts">
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

const props = defineProps<{
  imageLinks: Array<string>
}>()

const maxNumberOfVisibleImages = 3.5
const itemsToShow = Math.min(props.imageLinks.length, maxNumberOfVisibleImages)

const carouselConfig = {
  enabled: props.imageLinks.length > Math.floor(maxNumberOfVisibleImages),
  height: 200,
  itemsToShow: itemsToShow,
  wrapAround: props.imageLinks.length > Math.floor(maxNumberOfVisibleImages)
}
</script>

<template>
<Carousel v-bind="carouselConfig" :gap="20" :height="200" :i18n="{
    ariaNextSlide: 'Vorheriges Foto',
    ariaPreviousSlide: 'Nächstes Foto'
  }">
    <Slide v-for="link in props.imageLinks" :key="link">
      <img :src="link" />
    </Slide>

    <template #addons>
      <Navigation />
      <Pagination />
    </template>
  </Carousel>
</template>

<style scoped>
img {
  height: auto;
  max-height: 200px;
  max-width: 100%;
}
</style>

