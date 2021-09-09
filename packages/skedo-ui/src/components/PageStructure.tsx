import UIModel, { UIEvents } from "../object/UIModel"
import {Tree} from 'antd'
import {SwitcherOutlined, SelectOutlined, BorderOutlined} from '@ant-design/icons'
import { Node } from "@skedo/meta"


function getIcon(group :string) {
  switch(group) {
    case 'basic' :
      return <SwitcherOutlined />
    case "custom" :
      return <SelectOutlined />
    case 'container':
      return <BorderOutlined />
  }
}
function getTreeData(node : Node) : any{
  return {
    title : node.getName(),
    key : node.getId(),
    icon : getIcon(node.getGroup()),
    children : node.getChildren().map(child=>getTreeData(child))
  }
}
export const PageStructure = ({editor} : {
  editor : UIModel
}) => {
  const root = editor.page.getRoot()

  return (
    <Tree
      onSelect={e => {

        editor.dispatch(UIEvents.EvtSelected, editor.page.getNodeById(e[0] as number))
      }}
      showIcon
      defaultExpandAll
      treeData={[getTreeData(root)]}
    />
  ) 
}