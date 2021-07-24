import { NodeType as Node, BoxDescriptor } from "@skedo/core"

export default class NodeStyleHelper {
	
  static getBoxSyle(box : BoxDescriptor) : any{
    if(box.mode === 'fill') {
      return {
        width : '100%',
        height : '100%',
        left : 0,
        top : 0 
      }
    }
    return {
      width : box.width.isAuto ? '' : box.width.value + box.width.unit,
      height : box.height.isAuto ? '' : box.height.value + box.height.unit,
      left : box.left.isAuto ? '' : box.left.value + box.left.unit,
      top : box.top.isAuto ? '' : box.top.value + box.top.unit,
    }
  }

  static basicStyle(node : Node, parent : Node) {
    const box : BoxDescriptor = node.getBox()

    const style : any = {
      position : node.level === 0 ? 'relative' : 'absolute',
      boxSizing : "border-box",
      ...NodeStyleHelper.getBoxSyle(box)
    } 

    if(parent && parent.isFlex()) {
      style.position = 'relative'
      delete style.top
      delete style.left
    }

    Object.assign(style, NodeStyleHelper.getFlexStyle(node))
    if(node.isFlex()){
      if(node.getStyle("flexDirection") === 'column') {
        style.height = '100%'
        style.top = 0
      } else {
        style.width = '100%'
        style.left = 0
      }
    }

    style.border = 'none'
    const nodeStyle = node.getStyleObject()

    // 编辑器模式Margin用Padding表达
    // Padding应该是组件内部响应（不需要统一处理）
    style.padding = nodeStyle.margin 
    style.paddingLeft = nodeStyle.marginLeft
    style.paddingRight = nodeStyle.marginRight
    style.paddingTop = nodeStyle.marginTop
    style.paddingBottom = nodeStyle.marginBottom

    return style
  }

  static getFlexStyle(node : Node){
    const style :any = {}
    if(node.isFlex()){
      if(node.getStyle("flexDirection") === 'column') {
        style.height = '100%'
        style.top = 0
      } else {
        style.width = '100%'
        style.left = 0
      }
    }
    return style
  }

  movingStyle(node : Node){
    if(node.isMoving()) {
      if(node.getParent() && node.getParent().isFlex()) {
        return {
          position : '',
          backgroundColor : 'grey'
        }
      } else {
        return {
          zIndex : 1,
          // opacity : 0.8
        }
      }
    }
  }


  getRenderStyle(node: Node, autoResizing = false) : any{
    const style : any =  {} 
    Object.assign(style, NodeStyleHelper.basicStyle(node, node.getParent()))
    Object.assign(style, this.movingStyle(node))
    if(autoResizing) {
      delete style.width
      delete style.height
    }
    return style
  }

  getInnerStyle(node : Node) {
    const style = node.getStyleObject()
    if(node.getReceiving()) {
      style.background = "rgba(0,0,0,.05)"
    }
    delete style.margin
    delete style.marginTop
    delete style.marginLeft
    delete style.marginRight
    delete style.marginBottom
    return style
  }

  getFlexShadowStyle(node : Node, received : Node) :any {
    if(!node.getMountPoint() || !received.getMountPoint()) {
      return {}
    }
    const [left, top] = received.getMountPoint()!.positionDiff(node)
    const style = {
      position : 'absolute',
      left,
      top,
      width : received.getBox().width.value,
      height : received.getBox().height.value,
      background : `rgba(0,0,0,.15)`
    }

    Object.assign(style, NodeStyleHelper.getFlexStyle(received))
    return style
  }
}