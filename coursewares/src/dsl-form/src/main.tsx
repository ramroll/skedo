import React from 'react'
import ReactDOM from 'react-dom'
import userFormConfigure from "./user.form"
import {useForm, FormRender} from './component/form'

function App () {
  const form = useForm(userFormConfigure, {
    basic : {
      username : "李四"
    }
  })

  return <div>
    <FormRender node={form.getRoot()} />
    <button onClick={() => {
      console.log(form.getValues())
    }}>提交</button>

    <button onClick={e => {
      form.setValues({
        basic : {
          username : "张三",
          sex : "female"
        },
        product : {
          color : "red"
        }
      })
    }}>重置</button>
  </div>
}
ReactDOM.render(
  <App />,
  document.getElementById('root')
)
