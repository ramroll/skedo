import { SkedoNodeProxy } from "./SkedoNodeProxy"
import { SkedoEventName } from '@skedo/meta'


export type SkedoEvent = {
  type : SkedoEventName,
  node : SkedoNodeProxy
} 

export type SkedoEventHandler = (e? : SkedoEvent) => void