import { Node, Topic } from "@skedo/meta"
import { useContext, useEffect, useRef, useState } from "react"
import RenderContext from "../components/render/RenderContext"
import { UIStates } from "../object/UIModel"

export function useGapMoving(node : Node, type : 'row' | 'column'){

	const ctx = useContext(RenderContext)
	const gap = useRef<number | null>(null)
	const childrenRef = useRef<Array<Node | string>>(
		node.getChildren()
	)
	const [ver, setVer] = useState(0)

	useEffect(() => {
		node.on([Topic.NewNodeAdded, Topic.NodeChildrenChanged])
		.subscribe(() => {
			childrenRef.current = node.getChildren()
			setVer(x => x + 1)
		})
		ctx.editor!.on(Topic.MouseUpEventPass)
			.subscribe(() => {
				if(gap.current !== null) {
					gap.current = null
					childrenRef.current = node.getChildren()
					setVer(x=>x+1)
				}
			})

		ctx.editor!.on(Topic.GeneralMovingEvent)
			.subscribe(() => {
				if(ctx.editor?.underState(UIStates.Moving)) {
					const movingNode = ctx.editor.getSelection().first()
					const rect = movingNode.absRect()
					const x = rect.centerX()
					const y = rect.centerY()
					const thisRect = node.absRect()
					if(thisRect.bound(x, y)) {


						const sortedChildren = node.getChildren()
							.filter(x => x !== movingNode)
						

						if(type === 'row') {
							sortedChildren.sort(
                (a, b) =>
                  a.getRect().left - b.getRect().left
              )
						} else {
							sortedChildren.sort(
                (a, b) => a.getRect().top - b.getRect().top
              )
						}

						let f = 0
						if(sortedChildren.length !== node.getChildren().length) {
							f = 1
							sortedChildren.push(movingNode)
						}
						
						
						let idx = 0 
						for (
              let i = 0;
              i < sortedChildren.length - 1 - f;
              i++
            ) {
              const a = sortedChildren[i].absRect()
              const b = sortedChildren[i + 1].absRect()

							console.log(a.centerX(), x, b.centerX())
              if (type === "row") {
                if (a.centerX() <= x && b.centerX() > x) {
                  idx = i + 1
                  break
                }
              } else {
                if (a.centerY() <= y && b.centerY() > y) {
                  idx = i + 1
                  break
                }
              }
            }

						const lastNode = f === 0 ? sortedChildren[sortedChildren.length - 1]
							: sortedChildren[sortedChildren.length - 2]
						if(lastNode) {
							if(type === 'row') {
								if(lastNode.absRect().centerX() < x) {
									idx = sortedChildren.length
								}
							} else {
								if(lastNode.absRect().centerY() < x) {
									idx = sortedChildren.length
								}

							}
						}


						if(gap.current !== idx) {
							(sortedChildren as Array<Node | string>).splice(idx, 0, "__GAP__")
							childrenRef.current = sortedChildren 
							gap.current = idx
							setVer(x => x + 1)
						}
						return
					}
					if(gap.current !== null) {
						gap.current = null 
						childrenRef.current = node.getChildren()
						setVer(x => x + 1)
					}
				}
			})
	}, [])

	return childrenRef.current

}