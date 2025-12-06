import { defineStore } from 'pinia'

export const useVaultStore = defineStore('vault', {
  state: () => ({
    secretKey: null, // saved in browser
  }),

  actions: {
    setSecretKey (key) {
      this.secretKey = key
      localStorage.setItem('secretKey', key) // persist
    },

    loadFromCache () {
      const saved = localStorage.getItem('secretKey')
      if (saved) {
        this.secretKey = saved
      }
    },

    logout () {
      this.secretKey = null
      localStorage.removeItem('secretKey')
    },
  },
})
