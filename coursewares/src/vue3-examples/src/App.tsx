import './layout.css'
import { watch, watchEffect, ref, PropType, defineComponent } from "vue"
import {
  RouteRecordRaw,
  RouterLink,
  RouterView,
} from "vue-router"


export default defineComponent({
  props: {
    routes: {
      type: Array as PropType<
        Array<RouteRecordRaw & { key: string }>
      >,
    },
  },
  setup: (props) => {
    return () => {
			return <>
				<ul class="menu">
					{props.routes?.map(x => {
						return (
              <li key={x.key}>
                <RouterLink to={x.path}>{x.key}</RouterLink>
              </li>
            )
					})}
				</ul>
				<div class="content">
					<RouterView />
				</div>

			</>
    }
  },
})