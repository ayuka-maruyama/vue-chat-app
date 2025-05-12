import { createApp } from 'vue' // デフォルトで準備されているcreateAppを呼び出して実行してくれる
import App from './App.vue' // デフォルトインポート文を使用して読み込む

const app = createApp(App) // 引数に指定されたコンポーネントを使用してUIを作成する【必ず記述が必要】
app.mount('#app') // mountで#appの部分に今回指定するコンポーネントを追加することができる
