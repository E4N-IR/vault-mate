// stores/ui.js
import { defineStore } from 'pinia'

export const useUIView = defineStore('ui', {
  state: () => ({
    load: false,
  }),
  actions: {
    setLoading (value) {
      this.load = value
    },
  },
})
