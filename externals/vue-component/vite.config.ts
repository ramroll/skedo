import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  
  server : {
    port : 3002
  },
  build : {
    lib : {
      entry : resolve(__dirname, "src/components/Tabs.vue"),
      name : "tab"
    },
    rollupOptions : {
      external : "vue",
      output : {
        format : "amd",
        globals : {
          vue : "Vue"
        }

      }
    }
  },
  plugins: [vue()]
})
