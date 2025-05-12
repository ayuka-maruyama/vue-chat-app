<script setup>
import { computed } from 'vue'

const props = defineProps({
  messages: Array,
  currentUser: String,
  messageInput: String,
})
const emit = defineEmits(['chat', 'update:message-input', 'change-user'])

const groupedMessages = computed(() => {
  const groups = {}

  for (const msg of props.messages) {
    const date = msg.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(msg)
  }

  return Object.entries(groups)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([date, msgs]) => ({
      date,
      messages: msgs.sort(
        (a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`),
      ),
    }))
})

function sendMessage() {
  emit('chat')
}

function changeUser() {
  emit('change-user')
}

function onInput(event) {
  emit('update:message-input', event.target.value)
}
</script>

<template>
  <ul>
    <li v-for="(group, groupIndex) in groupedMessages" :key="groupIndex">
      <div class="date-separator">{{ group.date }}</div>

      <div
        v-for="(message, index) in group.messages"
        :key="index"
        :class="message.user === currentUser ? 'my-message' : 'other-message'"
      >
        <div class="user-info">
          <p class="user-name">{{ message.user }}</p>
          <p>{{ message.time }}</p>
        </div>

        <div class="message-bubble" :class="message.user === currentUser ? 'my' : 'other'">
          {{ message.text }}
        </div>
      </div>
    </li>
  </ul>
  <button @click="changeUser">切り替え</button>
  <p>{{ currentUser }}さんがコメント入力中…</p>

  <input type="text" :value="messageInput" @input="onInput" />
  <button @click="sendMessage">送信</button>
</template>

<style scoped>
input {
  width: 80%;
  margin-right: 10px;
  padding: 5px 10px;
}

ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 65vh;
  overflow-y: auto;
}

.user-info {
  display: flex;
}

.user-name,
.user-info {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 2px;
}

.user-name {
  margin-right: 10px;
}

.my-message,
.other-message {
  display: flex;
  flex-direction: column;
}

.my-message {
  align-self: flex-end;
  align-items: flex-end;
}

.other-message {
  align-self: flex-start;
  align-items: flex-start;
}

.message-bubble {
  color: white;
  padding: 10px;
  border-radius: 10px;
  display: inline-block;
  word-break: break-word;
  width: auto;
  max-width: 45%;
}

.message-bubble.my {
  background-color: blue;
}

.message-bubble.other {
  background-color: blueviolet;
}

.date-separator {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dotted gray;
  font-weight: bold;
}
</style>
