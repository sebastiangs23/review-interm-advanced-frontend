import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null as number | null,
    name: '' as string,
    email: '' as string,
    isLogged: false
  }),

  actions: {
    setUser(user: any) {
      this.id = user.id
      this.name = user.name
      this.email = user.email
      this.isLogged = true
    },
    logout() {
      this.id = null
      this.name = ''
      this.email = ''
      this.isLogged = false
    }
  },

  persist: true
})
