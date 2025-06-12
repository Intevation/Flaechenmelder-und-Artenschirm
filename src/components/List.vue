<script setup lang="ts">
const props = defineProps<{
  list: Array<string>
}>()
</script>

<template>
  <ul>
    <li v-for="(element, index) in props.list" v-bind:key="`list-${index}-${element}`">
      {{ element }}
    </li>
  </ul>
</template>

<style scoped></style>
