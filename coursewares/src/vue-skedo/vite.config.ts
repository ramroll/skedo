import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJSX from "@vitejs/plugin-vue-jsx"
// import closureId from './src/plugin/vite-plugin-closure-id'
import path from 'path'

export default defineConfig({
  alias : {
    "@" : path.resolve(__dirname, './src')
  },
  plugins: [vue(), vueJSX()]
})

