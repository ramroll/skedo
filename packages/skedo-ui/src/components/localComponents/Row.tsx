import { Bridge } from '@skedo/core'
import FlexContainer from './FlexContainer'
const Row = ({bridge} : {bridge : Bridge}) => {
  return <FlexContainer bridge={bridge} gap="row" />
}
export default Row