import {provide, defineComponent, inject} from 'vue'


type User = {
  avatar : string
}

const TitleBar = defineComponent({
  setup: () => {
    const user = inject('user') as User
    return () => (
      <header>
        <img src={user.avatar} />
      </header>
    )
  },
})

const Page = () => {
  return <TitleBar />
}

export const ProvideExample = defineComponent({
  setup : () => {
    provide('user', {
      avatar : "https://v3.vuejs.org/logo.png"
    })

    return () => {
      return <Page />
    }
  }

})
