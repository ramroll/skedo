import { Rect } from "@skedo/utils"
import { Node } from "./instance/Node"
import { BoxDescriptorInput, SizeUnitInput } from "./standard.types"

type Unit = 'px' | '%'
type SizeMode =  "fill" | "value" | "fixed"
export class SizeUnit{

	private value : number = 0
	private unit : Unit = 'px'
	private mode : SizeMode
	private parent!: BoxDescriptor
	private key : string

	constructor(value : number, unit : Unit, mode : SizeMode, key : string) {
		this.key = key
		this.value = value
		this.unit = unit
		this.mode = mode
	}

	public setMode(mode : SizeMode){
		this.mode = mode
	}

	public getMode(){
		return this.mode
	}

	public getValue(){
		return this.value
	}

	public getUnit(){
		return this.unit
	}

	public setUnit(unit : Unit){
		this.unit = unit
	}

	public toString(){
		if(this.mode === 'fill') {
			return '100%'
		}
		return this.value + this.unit
	}

	public toJSON() : SizeUnitInput {
		return {
			value : this.value,
			mode : this.mode,
			unit : this.unit
		}
	}

	public setParent(parent : BoxDescriptor) {
		this.parent = parent
	}
	
	public set(val : number) {
		if(this.mode === 'fixed') {
			return
		}
		if(this.unit === 'px') {
			this.value = val
		}
		else if(this.unit === '%') {
			const prect = this.parent.node.getParent().getRect()
			const parentWidth = prect.width
			const parentHeight = prect.height
			if(['marginTop', 'marginBottom', 'top', 'height'].indexOf(this.key) !== -1) {
				this.value = 100 * val / parentHeight
			} else {
				this.value = 100 * val / parentWidth
			}
		}
	}


	private getMax(rect : Rect) {
		if (
			[
				"marginTop",
				"marginBottom",
				"top",
				"height",
			].indexOf(this.key) !== -1
		) {
			return rect.height
		} else {
			return rect.width
		}
	}
	public toPxNumberWithRect(rect : Rect) {

		const realtiveMax = this.getMax(rect)
		if(this.mode === 'fill') {
			return realtiveMax
		}

		if (this.unit === "px") {
			return this.value 
		} else if (this.unit === "%") {
			return realtiveMax * this.value / 100
		}

		throw new Error("invalid sizeunit.")	
	}

	public toPxNumber(node : Node){
		const parent = node?.getParent()
		const prect = parent ? parent.getRect() : node?.getRect() 
		return this.toPxNumberWithRect(prect || Rect.ZERO)
		
	}

	
	public toNumber(){
		return this.toPxNumber(this.parent?.node)
	}

	public getKey(){
		return this.key
	}

	static parse(ipt : string | number | SizeUnitInput | undefined, key : string) : SizeUnit{
		if(typeof ipt === 'object') {
			return new SizeUnit(ipt.value, ipt.unit as Unit, ipt.mode, key)
		}

		if(ipt === 'fill') {
			return new SizeUnit(100, '%', 'fill', key)
		}


		if(typeof ipt === 'undefined' || ipt === '') {
			return new SizeUnit(0, 'px', 'value', key)
		}
		if(typeof ipt === 'number') {
			return new SizeUnit(ipt, 'px', 'value', key)
		}
		if(typeof ipt === 'string') {
			
			if(ipt.match(/^\d+(px|%)$/)) {
				let num = Number.parseFloat(ipt.replace(/(px | %)/, ""))
				const m = ipt.match(/(px|%)/)
				const unit = m?m[0] : "px"
				if(isNaN(num)) {
					num = 0	
				}
				return new SizeUnit(num, unit as Unit, 'value', key)
			}
	
			const val = Number.parseFloat(ipt)
			if(!isNaN(val)) {
				return new SizeUnit(val, 'px', 'value', key)
			}
	
		}
		throw new Error("Unrecognizable size input:" + ipt)
	}

	public clone(){
		const unit = new SizeUnit(
      this.value,
      this.unit,
      this.mode,
      this.key
    )
		unit.parent = this.parent
		return unit
	}

	public setValue(val : number) {
		this.value = val
	}
}

export class BoxDescriptor {
	node! : Node
	left : SizeUnit
	top : SizeUnit
	width : SizeUnit
	height : SizeUnit
	marginLeft : SizeUnit
	marginTop : SizeUnit
	marginBottom : SizeUnit
	marginRight : SizeUnit



	constructor(box? : BoxDescriptorInput) {
		if(!box) {
			box = {
				left : '',
				top : '',
				width : '',
				height : ''
			}
		}
		this.left = this.parseSizeUnit(box.left, "left")
		this.top = this.parseSizeUnit(box.top, "top")
		this.width = this.parseSizeUnit(box.width, "width")
		this.height = this.parseSizeUnit(box.height, "height")
		this.marginLeft = this.parseSizeUnit(
			box.marginLeft,
			"marginLeft"
		)
		this.marginRight = this.parseSizeUnit(
			box.marginRight,
			"marginRight"
		)
		this.marginBottom = this.parseSizeUnit(
			box.marginBottom,
			"marginBottom"
		)
		this.marginTop = this.parseSizeUnit(
			box.marginTop,
			"marginTop"
		)
	}

	public parseSizeUnit(ipt : string | number | SizeUnitInput | undefined, key : string){
		const unit = SizeUnit.parse(ipt, key)
		unit.setParent(this)
		return unit
	}

	public toJson() : BoxDescriptorInput{
		return {
			left : this.left.toJSON(), 
			top : this.top.toJSON(), 
			width : this.width.toJSON(),
			height : this.height.toJSON(),
			marginLeft : this.marginLeft.toJSON(), 
			marginTop : this.marginTop.toJSON(), 
			marginBottom : this.marginBottom.toJSON(), 
			marginRight : this.marginRight.toJSON() 
		}
	}

	public setNode(node : Node) {
		this.node = node
	}

	public toRect(){
		return new Rect(
			this.left.getValue(),
			this.top.getValue(),
			this.width.getValue(),
			this.height.getValue()
		) 
	}

	public clone(){
		const box = new BoxDescriptor()
		box.left = this.left.clone() 
		box.top = this.top.clone()
		box.width = this.width.clone()
		box.height = this.height.clone()
		return box
	}

}

