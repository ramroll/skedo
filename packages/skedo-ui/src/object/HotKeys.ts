import UIModel from "./UIModel";
import { equals } from "ramda"
import { Topic } from "@skedo/meta";


type CMDContext = {
  editor : UIModel
}

export default class Hotkeys {

  cmds : Array<Command> = []

  constructor(){
    this.cmds.push(new DeleteCommand(['Delete']))
    this.cmds.push(new DeleteCommand(['Backspace']))
    this.cmds.push(new EditCommand(['F2']))
  }

  run(keys : Array<string>, ctx : CMDContext){
    this.cmds.forEach(cmd => cmd._run(keys, ctx))
  }
}


class Command{
  private accepts : Array<string>

  constructor(accepts : Array<string>) {
    this.accepts = accepts
  }

  _run(keys : Array<string>, ctx : CMDContext){
    if(equals(keys, this.accepts)) {
      this.run(ctx)
    }
  }

  public run(ctx : CMDContext) {
    throw new Error("Not Implemented.")
  }
}

class EditCommand extends Command {
  run(ctx : CMDContext){
    const selection = ctx.editor.getSelection()
    selection.forEach(node => {
      node.emit(Topic.EditMode)
    })
    ctx.editor.clearSelection()
  }
}



class DeleteCommand extends Command {

  run(ctx : CMDContext){
    const activeElement = document.activeElement
    if(['INPUT', "TEXTAREA"].indexOf(activeElement?.tagName || '') !== -1) {
      return
    }


    const selection = ctx.editor.getSelection()
    selection.forEach(node => {
      node.destroy()
      node.getParent().emit(Topic.NodeChildrenChanged)
    })

    ctx.editor.clearSelection()
  }
}

