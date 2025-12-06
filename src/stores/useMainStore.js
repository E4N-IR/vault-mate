import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({ key: 0, payload: null }),
  actions: {
    setSecret (value) {
      this.key = value
    },
    setPayload (data) {
      this.payload = data
    },
  },
})
