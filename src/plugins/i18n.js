import { createI18n } from 'vue-i18n'
import {zhCN, en} from '@/locale'
export default function registerI18n(app) {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      en,
      zh: zhCN
    }
  })
  app.use(i18n)
}
