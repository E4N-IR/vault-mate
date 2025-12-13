<template>
  <v-card class="d-flex flex-column" height="100%">
    <v-card class="d-flex flex-column" width="100%">
      <v-row class="mt-5 px-10">
        <v-col>
          <div class="d-flex align-center">
            <v-btn
              class="mx-2"
              color="secondary"
              density="comfortable"
              flat
              height="40px"
              icon="mdi-chevron-right"
              variant="outlined"
              @click="$router.go(-1)"
            />
            <p>برگشت</p>
          </div>
        </v-col>
        <v-spacer />
        <v-col class="d-flex justify-end">
          <v-btn class="mx-2" color="primary" flat variant="outlined" @click="openDialog">
            افزودن اپلیکیشن
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="mt-4 my-10" />
      <NotExistCard v-if="listPass.length === 0" />
    </v-card>
    <v-card v-if="listPass.length > 0" flat>
      <AppCard
        v-for="item in listPass"
        :key="item.id"
        :data="item"
        :visible-password-index="visiblePasswordIndex"
        @delete="confirmDeleteApp"
        @edit="editApp"
        @toggle-details="toggleDetails"
        @toggle-password="togglePassword"
      />
    </v-card>

    <!-- Floating Save Button -->
    <v-btn
      v-if="listPass.length > 0"
      class="floating-btn"
      color="success"
      style="position: absolute; bottom: 10px; left: 20px"
      variant="outlined"
      @click="saveFile"
    >
      ذخیره
    </v-btn>

    <!-- Drawers and Dialogs -->
    <AppFormDrawer
      :key="dialog"
      ref="formContentRef"
      v-model="dialog"
      :form="form"
      :form-valid="formValid"
      :is-editing="isEditing"
      :show-password="showPassword"
      @submit="submitForm"
      @toggle-password="(v) => (showPassword = v)"
      @update:form="(v) => (form = v)"
    />
    <DeleteConfirmDrawer
      v-model="confirmDelete"
      :name="deleteData?.nameApp"
      @confirm-delete="deleteApplication"
    />
  </v-card>
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
    {{ snackbar.text }}
  </v-snackbar>
</template>
<script setup>
import CryptoJS from 'crypto-js'
// ============================
// Imports
// ============================
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useMainStore } from '@/stores/useMainStore'
import AppCard from './components/AppCard/AppCard.vue'
import NotExistCard from './components/AppCard/NotExistCard.vue'
import AppFormDrawer from './components/AppForm/AppFormDrawer.vue'
import DeleteConfirmDrawer from './components/DeleteConfirm/DeleteConfirmDrawer.vue'

// ============================
// Refs / Reactive / Computed
// ============================
const formContentRef = ref(null)
const store = useMainStore()
const dialog = ref(false)
const confirmDelete = ref(false)
const deleteData = ref(null)
const isEditing = ref(false)
const editId = ref(null)
const visiblePasswordIndex = ref(null)
const showPassword = ref(false)
const formValid = ref(false)
const router = useRouter()
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
})

const form = ref({
  nameApp: '',
  password: '',
  website: '',
  description: '',
  showDetails: false,
})

const listPass = ref([])

// ============================
// Utility Functions
// ============================

// Generate unique ID for new app
const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

// ============================
// Event Handlers
// ============================

// Open Add/Edit Form Drawer
const openDialog = () => {
  dialog.value = true
}

// Toggle password visibility in AppCard
const togglePassword = (item) =>
  (visiblePasswordIndex.value = visiblePasswordIndex.value === item.id ? null : item.id)

// Toggle app details visibility
const toggleDetails = (data) => (data.showDetails = !data.showDetails)

// Edit an existing app
const editApp = (data) => {
  isEditing.value = true
  dialog.value = true
  editId.value = data.id
  form.value = {
    nameApp: data.nameApp,
    password: data.password,
    website: data.website,
    description: data.description,
    showDetails: data.showDetails,
  }
}

const submitForm = async () => {
  const isValid = await formContentRef.value?.validateForm()
  if (!isValid.valid) return

  if (isEditing.value) {
    const index = listPass.value.findIndex((x) => x.id === editId.value)
    if (index !== -1) listPass.value[index] = { ...listPass.value[index], ...form.value }
  } else {
    listPass.value.push({ ...form.value, id: generateId() })
  }

  dialog.value = false
  isEditing.value = false
  editId.value = null
  form.value = {
    nameApp: '',
    password: '',
    website: '',
    description: '',
    showDetails: false,
  }
}

const confirmDeleteApp = (data) => {
  confirmDelete.value = true
  deleteData.value = data
}

const deleteApplication = () => {
  const index = listPass.value.findIndex((x) => x.id === deleteData.value.id)
  if (index !== -1) listPass.value.splice(index, 1)
  if (visiblePasswordIndex.value === deleteData.value.id) visiblePasswordIndex.value = null

  confirmDelete.value = false
}

const wordArrayToUint8Array = (wordArray) => {
  const words = wordArray.words
  const sigBytes = wordArray.sigBytes
  const u8 = new Uint8Array(sigBytes)
  let i = 0,
    j = 0

  while (i < sigBytes) {
    const w = words[j++]
    u8[i++] = (w >> 24) & 0xff
    if (i < sigBytes) u8[i++] = (w >> 16) & 0xff
    if (i < sigBytes) u8[i++] = (w >> 8) & 0xff
    if (i < sigBytes) u8[i++] = w & 0xff
  }
  return u8
}

const saveFile = () => {
  const vault = { apps: listPass.value, created: Date.now() }
  const vaultStr = JSON.stringify(vault)

  const salt = CryptoJS.lib.WordArray.random(16)
  const iv = CryptoJS.lib.WordArray.random(16)

  const masterKey = CryptoJS.PBKDF2(store.username + store.password, salt, {
    keySize: 256 / 32,
    iterations: 20_000,
  })

  const encrypted = CryptoJS.AES.encrypt(vaultStr, masterKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })

  const encryptedBytes = wordArrayToUint8Array(encrypted.ciphertext)
  const magic = new TextEncoder().encode('VSEC')
  const version = new Uint8Array([1])
  const saltBytes = wordArrayToUint8Array(salt)
  const ivBytes = wordArrayToUint8Array(iv)

  const totalLength =
    magic.length + version.length + saltBytes.length + ivBytes.length + encryptedBytes.length

  const finalFile = new Uint8Array(totalLength)

  let offset = 0
  finalFile.set(magic, offset)
  offset += magic.length

  finalFile.set(version, offset)
  offset += version.length

  finalFile.set(saltBytes, offset)
  offset += saltBytes.length

  finalFile.set(ivBytes, offset)
  offset += ivBytes.length

  finalFile.set(encryptedBytes, offset)
  console.log(encryptedBytes)
  console.log(offset)
  const blob = new Blob([finalFile], {
    type: 'application/octet-stream',
  })

  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `vault_${Date.now()}.vsec`
  a.click()
}

onBeforeMount(() => {
  if (!store.key) return router.go(-1)

  const created = store?.payload?.created || null
  if (!!created) {
    listPass.value = store?.payload?.apps || []
  }
})
</script>

<style scoped>
.desktop-dialog .v-card {
  max-height: 80vh;
}
.sky-animated-card {
  position: relative;
  padding: 16px;
  border-radius: 14px;
  border: 2px solid #b3e5fc;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(10px);
  animation: fadeSlideUp 0.4s ease forwards;
}
.sky-show-password {
  border-radius: 14px;
  border: 2px solid #b3e5fc;
  transition: all 0.3s ease;
}
.sky-animated-card:hover {
  transform: translateY(-4px) scale(1.015);
  box-shadow: 0 2px 3px rgba(179, 229, 252, 0.5);
  border-color: #81d4fa;
}
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.floating-btn {
  animation: floatButton 3s ease-in-out infinite;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}
.floating-btn:hover {
  transform: translateY(-4px) scale(1.03);
}
@keyframes floatButton {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
