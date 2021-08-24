import { Node, Topic } from "@skedo/meta"
import { Emiter, Logger, Rect} from '@skedo/utils'

const THROTTLE = 10

export interface LineDescriptor {
  dir: 0 | 1 // 0 - 水平 1 - 垂直
  type: 0 | 1 // 0-居中对齐线  1: 两侧对齐线
  pos: number
  distance: number
}

export class AssistLine extends Emiter<Topic> {
  logger: Logger = new Logger("assist")

  calculateLines(nodeRect : Rect, node : Node, receiver: Node) {
    // node.parent: 水平中心，垂直中心
    let lines: Array<LineDescriptor> = []
    const parent = node.getParent()

    if (parent) {
      // 0 : 水平线  1：垂直线
      const parentRect = parent.absRect()

      lines.push({
        dir: 0,
        type: 0,
        pos: parentRect.centerY(),
        distance: Math.abs(
          nodeRect.centerY() - parentRect.centerY()
        ),
      })

      lines.push({
        dir: 1,
        type: 0,
        pos: parentRect.centerX(),
        distance: Math.abs(
          nodeRect.centerX() - parentRect.centerX()
        ),
      })
    }

    // node.parent.children
    if (receiver) {
      for (let child of receiver.getChildren()) {
        if (child === node) {
          continue
        }

        const childRect = child.absRect()
        lines.push({
          dir: 0,
          type: 1,
          pos: childRect.top,
          distance: Math.abs(nodeRect.top - childRect.top),
        })
        lines.push({
          dir: 0,
          type: 1,
          pos: childRect.bottom(),
          distance: Math.abs(
            nodeRect.bottom() - childRect.bottom()
          ),
        })

        lines.push({
          dir: 1,
          type: 1,
          pos: childRect.left,
          distance: Math.abs(
            nodeRect.left - childRect.left
          ),
        })
        lines.push({
          dir: 1,
          type: 1,
          pos: childRect.right(),
          distance: Math.abs(
            nodeRect.right() - childRect.right()
          ),
        })
        lines.push({
          dir: 0,
          type: 0,
          pos: childRect.centerY(),
          distance: Math.abs(
            nodeRect.centerY() - childRect.centerY()
          ),
        })

        lines.push({
          dir: 1,
          type: 0,
          pos: childRect.centerX(),
          distance: Math.abs(
            nodeRect.centerX() - childRect.centerX()
          ),
        })
      }
    }

    lines = lines.filter((x) => x.distance < THROTTLE)

    if (lines.length > 1) {
      // 根据距离最小原则选出少量的辅助线
      lines.sort((x, y) => x.distance - y.distance)
      lines = lines.slice(0, 1)
    }

    return lines
  }

}
