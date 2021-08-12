import { Subscription } from 'rxjs'
import { Emiter } from "@skedo/utils"
import { Topic } from "@skedo/meta"
import { useEffect } from 'react'
type SubscribeGroup = [emiter : Emiter<Topic>, topic : Topic | Topic[]]

function isGroupArray(groups : SubscribeGroup | SubscribeGroup[]) : groups is SubscribeGroup[] {
	return !((groups[0] as any).emit)
}
export function useSubscribe(group : SubscribeGroup | SubscribeGroup[] , callback : (...args:Array<any>) => any) {

	function createSub(group :SubscribeGroup) : Subscription {
		const [emiter, topic] = group
		return emiter.on(topic)
			.subscribe((...data : Array<any>) => {
				callback(...data)
			})
	}

	useEffect(() => {
		const subs : Array<Subscription> = []
		if(isGroupArray(group)) {
			group.forEach(g => {
				subs.push(createSub(g))
			})
		}
		else {
			subs.push(createSub(group))
		}
		return () => {
			subs.forEach(sub=>sub.unsubscribe())
		}
	}, [])

}