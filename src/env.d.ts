/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VALID_USERNAME: string
  readonly VITE_VALID_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}