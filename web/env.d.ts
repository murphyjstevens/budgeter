/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VUE_APP_API_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
