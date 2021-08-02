import { Bridge } from '@skedo/meta'
import FlexContainer from './FlexContainer'
const Column = ({bridge} : {bridge : Bridge}) => {
  return <FlexContainer bridge={bridge} gap="col" />
}
export default Column 