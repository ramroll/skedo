import { createApp } from "vue"
import App from "./App"
import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  Router,
} from "vue-router"

const stories = import.meta.glob("./stories/**/*.tsx")

const modulePromises = Object.keys(stories)
  .map((x) => stories[x])
  .map((x) => x())
const routes: (RouteRecordRaw & { key: string })[] = []
Promise.all(modulePromises).then((list) => {
  for (let module of list) {
    for (let key in module) {
      const Component = module[key]
      routes.push({
        path: "/" + key.toLowerCase(),
        key,
        component: Component,
      })
    }
  }
  const router: Router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
  })

  const app = createApp(App, { routes })
  app.use(router)
  app.mount("#app")
})
