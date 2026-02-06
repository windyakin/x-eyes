import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import ja from './locales/ja'
import en from './locales/en'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/main.css'

const browserLocale = navigator.language.split('-')[0]

const i18n = createI18n({
  legacy: false,
  locale: browserLocale === 'ja' ? 'ja' : 'en',
  fallbackLocale: 'en',
  messages: { ja, en },
})

createApp(App).use(i18n).mount('#app')
