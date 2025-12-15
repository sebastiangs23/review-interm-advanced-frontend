import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    background: 'white',
    colorPalette: '#4fadbe'
  }),

  actions: {
    setBackground(color: 'white' | 'gray') {
      this.background = color
    },
    setColorPalette(palette: string){
      this.colorPalette = palette
    }
  },
  persist: true
})
