import  {useEffect, useRef, RefObject, useState} from 'react'
import {Rect} from "@skedo/utils"

const useBound = ( callback? : (rect : Rect) => void ) : [Rect, RefObject<HTMLDivElement>] => {

  const [rect, setRect] = useState(Rect.ZERO)

  useEffect(() => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect()
      const bound = new Rect(
        Math.round(r.left),
        Math.round(r.top),
        Math.round(r.width),
        Math.round(r.height)
      )
      callback && callback(bound)
      setRect(bound)
    }
  }, [callback])
  const ref = useRef<HTMLDivElement>(null)
  return [rect, ref]

}  

export default useBound