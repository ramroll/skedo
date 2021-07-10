<template>
  <!-- <Tabs :style="style" :tabs="tabs" :bridge="bridge">
  </Tabs> -->
  <Scroller :bridge="bridge" />
</template>

<script lang="ts">
import { Bridge, Emiter, Topic, Node } from '@skedo/core'
import { defineComponent } from 'vue'
import Tabs from './components/Tabs.vue'
import Scroller from './components/Scroller.vue'

export default defineComponent({
  name: 'App',
  components: {
    Tabs,
    Scroller
  },
  data : () => {

    const bridge = Bridge.getMockBridge()
    return {
      style : {
        height : '400px'
      },
      bridge
    }
  }
  
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
