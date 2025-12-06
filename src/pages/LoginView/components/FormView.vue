<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-row dense>
      <!-- نام کاربری -->
      <v-col class="px-4 d-flex flex-column" cols="12">
        <p class="my-2">نام کاربری</p>
        <v-text-field
          autocomplete="off"
          v-model="username"
          autofocus
          class="mb-4"
          dir="ltr"
          inputmode="latin"
          outlined
          :rules="[usernameRule]"
          @copy="preventClipboard"
          @cut="preventClipboard"
          @keydown.enter="submitForm"
          @paste="preventClipboard"
        />

        <p class="my-2">رمز عبور</p>
        <v-text-field
          v-model="password"
          class="mb-2"
          dir="ltr"
          inputmode="latin"
          outlined
          :rules="[passwordCharRule, passwordRule]"
          :type="showPassword ? 'text' : 'password'"
          @copy="preventClipboard"
          @cut="preventClipboard"
          @input="filterPassword"
          @keydown.enter="submitForm"
          @paste="preventClipboard"
        >
          <template #prepend-inner>
            <v-icon
              class="cursor-pointer"
              @mousedown.prevent="showPassword = true"
              @mouseleave.prevent="showPassword = false"
              @mouseup.prevent="showPassword = false"
              @touchend.prevent="showPassword = false"
              @touchstart.prevent="showPassword = true"
            >
              {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
            </v-icon>
          </template>
        </v-text-field>

        <!-- نمایش پیچیدگی رمز -->
        <v-sheet class="pa-3 mt-10" outlined>
          <p class="mb-1">پیچیدگی رمز:</p>
          <v-row dense>
            <v-col class="d-flex align-center" cols="4">
              <v-icon v-if="passwordChecks.length > 0" color="green" small>mdi-check</v-icon>
              <v-icon v-else color="red" small>mdi-close</v-icon>
              <span class="ml-2">حداقل ۸ کاراکتر</span>
            </v-col>
            <v-col class="d-flex align-center" cols="4">
              <v-icon v-if="passwordChecks.uppercase" color="green" small>mdi-check</v-icon>
              <v-icon v-else color="red" small>mdi-close</v-icon>
              <span class="ml-2">حرف بزرگ</span>
            </v-col>
            <v-col class="d-flex align-center" cols="4">
              <v-icon v-if="passwordChecks.lowercase" color="green" small>mdi-check</v-icon>
              <v-icon v-else color="red" small>mdi-close</v-icon>
              <span class="ml-2">حرف کوچک</span>
            </v-col>
            <v-col class="d-flex align-center" cols="4">
              <v-icon v-if="passwordChecks.special" color="green" small>mdi-check</v-icon>
              <v-icon v-else color="red" small>mdi-close</v-icon>
              <span class="ml-2">کاراکتر خاص</span>
            </v-col>
            <v-col class="d-flex align-center" cols="4">
              <v-icon v-if="passwordChecks.number" color="green" small>mdi-check</v-icon>
              <v-icon v-else color="red" small>mdi-close</v-icon>
              <span class="ml-2">عدد</span>
            </v-col>
          </v-row>
        </v-sheet>

        <!-- دکمه ثبت -->
        <v-btn class="mt-4" color="primary" height="58px" width="100%" @click="submitForm">
          ثبت
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { computed, ref } from 'vue'

const emit = defineEmits(['submitted'])

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const valid = ref(false)
const snackbar = ref(false)

const passwordChecks = computed(() => ({
  length: password.value.length >= 8,
  uppercase: /[A-Z]/.test(password.value),
  lowercase: /[a-z]/.test(password.value),
  number: /[0-9]/.test(password.value),
  special: /[!@#$%^&*(),.?":{}|<>]/.test(password.value),
}))

// Rules
function usernameRule(value) {
  if (/[^A-Za-z0-9]/.test(value)) return 'نام کاربری فقط باید لاتین باشد'
  if (value.length < 4) return 'نام کاربری باید حداقل ۴ کاراکتر داشته باشد'
  return true
}

function passwordCharRule(value) {
  if (/[^A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value))
    return 'رمز عبور فقط حروف انگلیسی، اعداد و کاراکترهای مجاز باشد'
  return true
}

function passwordRule() {
  const c = passwordChecks.value
  return c.length > 0 && c.uppercase && c.lowercase && c.number && c.special
    ? true
    : 'رمز عبور شما پیچیدگی لازم را ندارد'
}

function filterPassword(e) {
  password.value = e.target.value.replace(/[^A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '')
}
function preventClipboard(e) {
  e.preventDefault()
}
const form = ref(null)
function submitForm() {
  form.value.validate()
  if (valid.value) {
    snackbar.value = true
    emit('submitted', { username: username.value, password: password.value })
  }
}
</script>
