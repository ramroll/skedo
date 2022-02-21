import {ref, Ref} from 'vue'
class FormData<T> {
  private data : Ref<any>

  constructor(data : T) {
    this.data = ref(data || {})
  }

  setValue(name : string, val : any) {
    const next = { ...this.data.value, [name]: val }
    this.data.value = next
  }

  getValue(name : string) {
    return this.data.value[name]
  }

  getValues(){
    return this.data
  }

  setValues(values : T){
    this.data.value = values
  }

  getField(name : string) {
    return {
      onChange : (v : any) => {
        this.setValue(name, v)
      },
      value : this.getValue(name)
    }
  }
}

type FormDataProxy<T> =  {
  [P in keyof T] : T[P]
}

export function useForm<T extends Record<string, any>>(data : T) {
  const form = new FormData(data)
  const ver = ref(0)

  const proxy = new Proxy(form, {
    get(target, name) {
      switch(name) {
        case 'getValues' :
          return form.getValues.bind(form)
        case 'setValues' :
          return form.setValues.bind(form)
        default:
          return form.getField(name as string)
      }
    },
    set(target, name, value) {
      switch(name) {
        case 'getValues' :
        case 'setValues' :
          break
        default:
          form.setValue(name as string, value)
      }
      return true
    }
  }) as any as FormDataProxy<T> & {
    setValues : (val : T) => void,
    getValues : () => Ref<T>
  }
  return {form : proxy, ver}
}
