// utils/cryptoHelper.js

const encoder = new TextEncoder()
const decoder = new TextDecoder()

const MAGIC = 'VSEC'
const VERSION = 1

// --- Derive Key Using PBKDF2 ---
export async function deriveKey (password, salt) {
  const baseKey = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveKey',
  ])

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 200_000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

// --- Encrypt Vault Data ---
export async function encryptVault (password, jsonObj) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))

  const key = await deriveKey(password, salt)
  const data = encoder.encode(JSON.stringify(jsonObj))

  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data))

  // Build custom file format
  const magicBytes = encoder.encode(MAGIC)
  const versionByte = new Uint8Array([VERSION])

  const finalLength
    = magicBytes.length + versionByte.length + salt.length + iv.length + encrypted.length

  const final = new Uint8Array(finalLength)
  let offset = 0

  final.set(magicBytes, offset)
  offset += magicBytes.length
  final.set(versionByte, offset)
  offset += versionByte.length
  final.set(salt, offset)
  offset += salt.length
  final.set(iv, offset)
  offset += iv.length
  final.set(encrypted, offset)

  return final
}

// --- Decrypt Vault File ---
export async function decryptVault (password, fileBuffer) {
  const bytes = new Uint8Array(fileBuffer)

  const magic = decoder.decode(bytes.slice(0, 4))
  if (magic !== MAGIC) {
    throw new Error('Invalid file format')
  }

  const version = bytes[4]
  if (version !== VERSION) {
    throw new Error('Unsupported version')
  }

  const salt = bytes.slice(5, 21)
  const iv = bytes.slice(21, 33)
  const encrypted = bytes.slice(33)

  const key = await deriveKey(password, salt)

  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted)

  return JSON.parse(decoder.decode(decrypted))
}

// --- Save file (desktop & mobile) ---
export function saveBinaryMobile (filename, uint8array) {
  const blob = new Blob([uint8array], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename

  document.body.append(a)
  a.click()
  a.remove()

  setTimeout(() => URL.revokeObjectURL(url), 300)
}
