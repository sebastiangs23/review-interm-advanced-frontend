import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    background: 'white',
  }),

  actions: {
    setBackground(color: 'white' | 'gray') {
      this.background = color
    }
  },
  persist: true
})
