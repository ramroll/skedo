import style from  "./frame.module.scss"
import {Tooltip, message } from 'antd'

interface RouteProps {
  src : string,
  active? :boolean,
  path ? : string,
  title : string,
  onClick? : Function
}

const Route = ({ src, active, path, title, onClick}: RouteProps) => {
  return (
    <Tooltip placement="bottom" title={title}>
      <div
        onClick={(e) => {
          if(onClick) {
            onClick()
          }
          if (path) {
            window.location.href = path
          }
        }}
        className={
          style.btn + " " + (active ? style.active : "")
        }
      >
        <img src={src} alt="" />
      </div>
    </Tooltip>
  )
}

const TitleBar = ({pageName, name, children = null} : {
  pageName : string,
  name : string,
  children? : JSX.Element[] | JSX.Element | null
}) => {
  return (
    <header className={style.titlebar}>
      <h2>SKEDO</h2>
      <div className={style.cmds}>{children}</div>
      <div className={style.router}>
        <Route
          active={name === "skedo"}
          title="搭建平台"
          path={`/skedo/${pageName}`}
          src="https://voice-static.oss-accelerate.aliyuncs.com//img/901888239b96b6f1d39ce060cc0b57009236bfa3.png"
        />
        <Route
          active={name === "codeless"}
          title="轻代码"
          path={`/codeless/${pageName}`}
          src="https://voice-static.oss-accelerate.aliyuncs.com//img/8ff6fd7149b9def759a1f1c6760ac1beaf18557d.png"
        />
        <Route
          title="服务端"
          active={name === "faas"}
          path={`/faas/${pageName}`}
          src="https://voice-static.oss-accelerate.aliyuncs.com//img/7d614228eaaa473246435d58e5c51700732d88f8.png"
        />
        <Route
          title="预览"
          active={name === "preview"}
          path={"/preview/" + pageName}
          src="https://voice-static.oss-accelerate.aliyuncs.com//img/7ced72ba49b0a9514f7c22606ad87e21eb56c2ed.png"
        />
        <Route 
          title="上线平台"
          onClick={() => {
            message.info("暂不支持")
          }}
          src="https://voice-static.oss-accelerate.aliyuncs.com//img/7e463508667bfc093130e8cd84690c12396cc2c2.png" />
      </div>
    </header>
  )
}

export default TitleBar