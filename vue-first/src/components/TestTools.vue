<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['add-yesterday'])

function addYesterdayMessage() {
  emit('add-yesterday')
}
</script>

<template>
  <button @click="addYesterdayMessage">デモ昨日メッセージ</button>
</template>
