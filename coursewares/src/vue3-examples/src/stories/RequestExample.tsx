import {ref, defineComponent} from 'vue'
import Mock from 'mockjs'


type Product = {
  name : string
}
function useProducts() {
  const list = ref<Product[] | null>(null)

  async function request() {
    list.value = Mock.mock({
      "array|1-10" : [{
        name: /iphone|xiaomi|hongmi|huawei|sanxing|google|ms/,
      }],
    }).array
    console.log(list.value)
  }
  request()

  return {
    list,
    reload: request,
  }
}


export const ProductList = defineComponent({

  setup() {

    const {list, reload} = useProducts()

    return () => {
      return <div>

        <button onClick={reload}>reload</button>
        <ul>
          {list.value?.map( (x, i) => {
            return <li key={i}>{x.name}</li>
          })}
        </ul>

      </div>

    }
  }

})