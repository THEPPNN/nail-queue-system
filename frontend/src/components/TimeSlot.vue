<template>
  <div class="slots">
    <button
      v-for="t in slots"
      :key="t"
      class="btn btn-sm"
      :class="t === selected
        ? 'btn-primary'
        : 'btn-outline-primary'"
      @click="$emit('select', t)"
    >
      {{ t }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  slots: Array,
  selected: String
})
</script>

<style scoped>
.slots button {
  margin: 5px;
}
</style>