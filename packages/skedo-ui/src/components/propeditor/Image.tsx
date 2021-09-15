import { PropComponentProps } from "./propeditor.types"
import classes from './prop-editor.module.scss'
import { fileRemote } from '@skedo/request'

export default ({
  onChange,
  propValue,
  metaProps,
  disabled,
}: PropComponentProps) => {

  return (
    <div className={classes.image}>
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            fileRemote
              .post2(e.target.files[0])
              .then((json) => {
                onChange(json.data)
              })
          }
        }}
      />
      <img
        src={
          propValue 
        }
        alt=""
      />
    </div>
  )
}