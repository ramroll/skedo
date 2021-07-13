import { createApp } from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import Tabs from './components/Tabs.vue'
import App from './components/App.vue'

const router = createRouter({
	history : createWebHistory(),
	routes : [
		{
			path :'/tabs',
			component :Tabs ,
			props : {
				style : {
					minHeight : "400px"
				}
			}
		}
	]
})
createApp(App).use(router).mount('#app')
