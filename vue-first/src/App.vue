<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import TestTools from './components/TestTools.vue'
import ChatApp from './components/ChatApp.vue'

// ユーザーの切り替え
const users = ['A', 'B']
const currentUserIndex = ref(0)
const currentUser = computed(() => users[currentUserIndex.value])

// メッセージ入力欄
const messageInput = ref('')

// メッセージ一覧（localStorageから取得）
const storedMessages = localStorage.getItem('messages')
const messages = ref(storedMessages ? JSON.parse(storedMessages) : [])

// ユーザー切り替え
function change() {
  currentUserIndex.value = currentUserIndex.value === 0 ? 1 : 0
}

// メッセージ送信
function sendMessage() {
  const now = new Date()

  if (messageInput.value.trim() !== '') {
    messages.value.push({
      user: currentUser.value,
      text: messageInput.value,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
    messageInput.value = ''

    // メッセージ送信後にスクロールを一番下に
    nextTick(() => {
      const ul = document.querySelector('ul')
      ul.scrollTop = ul.scrollHeight
    })
  }
}

// 昨日のメッセージを追加（デモ用）
function handleAddYesterday() {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  messages.value.push({
    user: currentUser.value,
    text: 'これは昨日のメッセージです',
    date: yesterday.toLocaleDateString(),
    time: yesterday.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  })
}

// localStorageのメッセージを復元し、日付・時刻がないものを補完
onMounted(() => {
  const saved = localStorage.getItem('messages')
  if (saved) {
    const parsed = JSON.parse(saved)

    parsed.forEach((message) => {
      if (!message.date || !message.time) {
        const now = new Date()
        message.date = now.toLocaleDateString()
        message.time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    })

    messages.value = parsed
  }
})

// messages変更時にlocalStorageへ保存
watch(
  messages,
  async (newVal) => {
    localStorage.setItem('messages', JSON.stringify(newVal))
    await nextTick() // DOMの更新を待ってからスクロールする
    const messagesContainer = document.querySelector('ul')
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  },
  { deep: true },
)
</script>

<template>
  <h1>LINE風アプリ</h1>
  <ChatApp
    :messages="messages"
    :current-user="currentUser"
    :message-input="messageInput"
    @chat="sendMessage"
    @change-user="change"
    @update:message-input="(val) => (messageInput = val)"
  />
  <TestTools @add-yesterday="handleAddYesterday" />
</template>

<style>
body {
  width: 90%;
  margin: 10px auto;
}

button {
  border: none;
  background-color: blue;
  color: #fff;
  padding: 5px 10px;
  margin-right: 5px;
}
</style>
