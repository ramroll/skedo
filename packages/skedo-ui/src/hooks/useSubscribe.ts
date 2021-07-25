import {Subscriber} from 'rxjs'
import { Emiter, Topic } from "@skedo/core"
import { useEffect } from 'react'

export function useSubscribe(emiter : Emiter<Topic>, topic : Topic | Topic[] , callback : (...args:Array<any>) => any) {

	useEffect(() => {
		const sub = emiter.on(topic)
			.subscribe((...data) => {
				callback(...data)
			})

		return () => {
			sub.unsubscribe()
		}
	})

}