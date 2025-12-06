<template>
  <v-card class="d-flex flex-column justify-center mt-10 pb-10">
    <p class="text-center my-10 text-h4">ایمنو</p>

    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row class="mx-0">
        <v-col class="px-4 d-flex align-center" cols="12" md="6">
          <FormView @submitted="submitForm" />
        </v-col>

        <v-col class="px-4 d-flex align-center" cols="12" md="6">
          <SecurityText />
        </v-col>
      </v-row>
    </v-form>
  </v-card>

  <v-dialog v-model="selectUser" width="500px">
    <v-card class="pa-5">
      <p>لطفا یکی از گزینه‌های زیر را انتخاب کنید</p>

      <v-card-actions class="mt-5">
        <v-btn class="mx-5" color="warning" flat variant="outlined" @click="createVault">
          ایجاد فایل جدید
        </v-btn>

        <v-btn color="secondary" flat variant="outlined" @click="openFilePicker">
          انتخاب فایل
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
    {{ snackbar.text }}
  </v-snackbar>

  <input ref="fileInput" style="display: none" type="file" @change="handleFile" />
</template>
<script setup>
import CryptoJS from 'crypto-js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUIView } from '@/stores/ui'
import { useMainStore } from '@/stores/useMainStore'
import FormView from './components/FormView.vue'
import SecurityText from './components/SecurityText.vue'

const store = useMainStore()
const ui = useUIView()

const valid = ref(false)
const selectUser = ref(false)
const payload = ref(null)
const router = useRouter()
const fileInput = ref()
const snackbar = ref({ show: false, text: '', color: 'success' })

const showSnack = (text, color = 'success') => {
  snackbar.value = { show: true, text, color }
}

const uint8ArrayToWordArray = (u8Array) => {
  const words = []
  for (const [i, element] of u8Array.entries()) {
    words[(i / 4) | 0] |= element << (24 - 8 * (i % 4))
  }
  return CryptoJS.lib.WordArray.create(words, u8Array.length)
}

const submitForm = async (data) => {
  payload.value = data
  selectUser.value = true
}

const openFilePicker = () => {
  fileInput.value.click()
}

const createVault = async () => {
  try {
    ui.setLoading(true)
    const salt = CryptoJS.lib.WordArray.random(16)
    const masterKey = CryptoJS.PBKDF2(payload.value.username + payload.value.password, salt, {
      keySize: 256 / 32,
      iterations: 20_000,
    })

    store.setSecret(masterKey)
    store.username = payload.value.username
    store.password = payload.value.password
    selectUser.value = false
    router.push({ name: 'DashboardView' })
  } catch (error) {
    console.error(error)
  } finally {
    ui.setLoading(false)
  }
}

const handleFile = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()

  reader.addEventListener('load', async (e) => {
    const fileBytes = new Uint8Array(e.target.result)

    let offset = 0
    offset += 4
    offset += 1
    const saltBytes = fileBytes.slice(offset, offset + 16)
    offset += 16
    const ivBytes = fileBytes.slice(offset, offset + 16)
    offset += 16
    const cipherBytes = fileBytes.slice(offset)

    const saltWA = uint8ArrayToWordArray(saltBytes)
    const ivWA = uint8ArrayToWordArray(ivBytes)
    const cipherWA = uint8ArrayToWordArray(cipherBytes)

    try {
      const masterKey = CryptoJS.PBKDF2(payload.value.username + payload.value.password, saltWA, {
        keySize: 256 / 32,
        iterations: 20_000,
      })

      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: cipherWA,
      })

      const decrypted = CryptoJS.AES.decrypt(cipherParams, masterKey, {
        iv: ivWA,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      })

      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8)
      if (!decryptedText) throw new Error('رمز اشتباه است')

      const parsed = JSON.parse(decryptedText)

      store.setSecret(masterKey)
      store.username = payload.value.username
      store.password = payload.value.password
      store.setPayload(parsed)

      router.push({ name: 'DashboardView' })
    } catch (error) {
      showSnack('نام کاربری یا رمز عبور اشتباه است', 'error')
      console.error('Error decrypting file:', error)
    } finally {
      event.target.value = null
    }
  })

  reader.readAsArrayBuffer(file)
}
</script>
