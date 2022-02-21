import { defineComponent } from "vue"

type HelloWorldProps = {
	msg : string
}


const Title = ({msg} : HelloWorldProps) => {
  return <h1>{msg}</h1>
}

const Hellworld = defineComponent({
	props  : {
		msg : {
			type : String
		}
	},
	setup() {

		return ({msg} : any) => {
			console.log(msg)
			return <Title msg={msg} />
		}
	}
})
export default Hellworld


// JSX = react
