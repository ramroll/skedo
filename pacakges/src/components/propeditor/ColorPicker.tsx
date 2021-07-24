import {useState} from 'react'
import style from './prop-editor.module.scss'
import Mask from './Mask'
import {SketchPicker} from 'react-color'

interface ColorPickerProps {
  disabled : boolean,
  onChange : (color :string) => void,
  defaultValue : string
} 

const ColorPicker = ({onChange, defaultValue, disabled} : ColorPickerProps) => {
  // 0 - 折叠
  // 1 - 展开
  const [state, setState] = useState(0)
  const [color, setColor] = useState(defaultValue)

  return (
    <div className={style["color-picker"]}>
      <div
        onClick={(x) => setState((x) => 1 - x)}
        style={{
          width: 20,
          height: 20,
          backgroundColor: color,
        }}
      />
      {state === 1 && (
        <Mask display={state === 1} onClick={() => {
          setState(0)
        }}>
          <SketchPicker
            disableAlpha={disabled}
            color={color}
            onChangeComplete={(x) => {
              onChange(x.hex)
              setColor(x.hex)
            }}
          />
        </Mask>
      )}
    </div>
  )
}

export default ColorPicker