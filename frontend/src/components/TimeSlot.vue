<template>
    <div class="slots">
      <button
        v-for="t in slots"
        :key="t"
        @click="$emit('select', t)"
      >
        {{ t }}
      </button>
    </div>
  </template>
  
  <script setup>
  defineProps({
    slots: Array
  })
  </script>
  
  <style>
  .slots button {
    margin: 5px;
  }
  </style>