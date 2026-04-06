/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL de base de l’API (ex. https://ton-api.onrender.com). Sans slash final. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
