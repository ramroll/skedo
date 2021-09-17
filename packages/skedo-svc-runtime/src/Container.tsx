import {NodeRender} from '@skedo/render'
import {usePage} from './usePage'

export default () => {
  const page = usePage("test1")
  if(page === null) {
    return null
  }

  const node = page.getRoot().getChildren()[0]
  node.setXY(0, 0)
  // return <div className={classes.block}>123</div>
  return <NodeRender node={node} />
}