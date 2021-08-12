import { Rect } from "@skedo/utils"
import { Node } from "./instance/Node"
import { BoxDescriptorInput, SizeUnitInput } from "./standard.types"

type Unit = 'px' | '%'
export class SizeUnit{

	value : number = 0
	unit : Unit = 'px'
	isAuto : boolean 
	private parent!: BoxDescriptor
	private key : string

	constructor(value : number, unit : Unit, isAuto : boolean, key : string) {
		this.key = key
		this.value = value
		this.unit = unit
		this.isAuto = isAuto
	}

	public toString(){
		
		if(this.isAuto) {
			return ""
		}
		return this.value + this.unit
	}

	public setParent(parent : BoxDescriptor) {
		this.parent = parent
	}
	
	public set(val : number) {
		if(this.unit === 'px') {
			this.value = val
		}
		else if(this.unit === '%') {
			const prect = this.parent.node.getParent().getRect()
			const parentWidth = prect.width
			const parentHeight = prect.height
			if(['marginTop', 'marginBottom', 'top', 'height'].indexOf(this.key) !== -1) {
				this.value = val / parentHeight
			} else {
				this.value = val / parentWidth
			}
		}
	}

	public toNumber(){

		const parent = this.parent.node.getParent()
		const prect = parent ? parent.getRect() : this.parent.node.getRect() 

	  if (this.isAuto) {
			return 0
		}
		if (this.unit === "px") {
			return this.value
		} else if (this.unit === "%") {
			if (
				[
					"marginTop",
					"marginBottom",
					"top",
					"height",
				].indexOf(this.key) !== -1
			) {
				return Math.round((prect.height * this.value) / 100)
			} else {
				return Math.round((prect.width * this.value) / 100)
			}
		}
		throw new Error("invalid sizeunit.")	
	}

	public getKey(){
		return this.key
	}

	static parse(ipt : string | number | SizeUnitInput | undefined, key : string) : SizeUnit{
		if(typeof ipt === 'object') {
			return new SizeUnit(ipt.value, ipt.unit as Unit, ipt.isAuto, key)
		}

		if(typeof ipt === 'undefined' || ipt === '' || ipt === 'px') {
			return new SizeUnit(0, 'px', true, key)
		}
		if(typeof ipt === 'number') {
			return new SizeUnit(ipt, 'px', false, key)
		}
		if(typeof ipt === 'string') {
			
			if(ipt.match(/^\d+(px|%)$/)) {
				let num = Number.parseFloat(ipt.replace(/(px | %)/, ""))
				const m = ipt.match(/(px|%)/)
				const unit = m?m[0] : "px"
				if(isNaN(num)) {
					num = 0	
				}
				return new SizeUnit(num, unit as Unit, false, key)
			}
	
			const val = Number.parseFloat(ipt)
			if(!isNaN(val)) {
				return new SizeUnit(val, 'px', false, key)
			}
	
		}
		throw new Error("Unrecognizable size input:" + ipt)
	}
}

export class BoxDescriptor {
	mode : string
	node! : Node
	left : SizeUnit
	top : SizeUnit
	width : SizeUnit
	height : SizeUnit
	marginLeft : SizeUnit
	marginTop : SizeUnit
	marginBottom : SizeUnit
	marginRight : SizeUnit


	constructor(box : BoxDescriptorInput) {
		this.mode = box.mode
		this.left = this.parseSizeUnit(box.left, 'left')
		this.top = this.parseSizeUnit(box.top, 'top')
		if(this.mode === 'fill') {
			this.width = this.parseSizeUnit('100%', 'width')
			this.height = this.parseSizeUnit("100%", 'height')
		} else {
			this.width = this.parseSizeUnit(box.width, 'width')
			this.height = this.parseSizeUnit(box.height, 'height')
		}
		this.marginLeft = this.parseSizeUnit(box.marginLeft, 'marginLeft')
		this.marginRight = this.parseSizeUnit(box.marginRight, 'marginRight')
		this.marginBottom = this.parseSizeUnit(box.marginBottom, 'marginBottom')
		this.marginTop = this.parseSizeUnit(box.marginTop, 'marginTop')
	}

	public parseSizeUnit(ipt : string | number | SizeUnitInput | undefined, key : string){
		const unit = SizeUnit.parse(ipt, key)
		unit.setParent(this)
		return unit
	}

	public toJson() : BoxDescriptorInput{
		return {
			mode : this.mode, 
			left : this.left.toString(), 
			top : this.top.toString(), 
			width : this.width.toString(),
			height : this.height.toString(),
			marginLeft : this.marginLeft.toString(), 
			marginTop : this.marginTop.toString(), 
			marginBottom : this.marginBottom.toString(), 
			marginRight : this.marginRight.toString() 
		}
	}

	public setNode(node : Node) {
		this.node = node
	}

	public toRect(){
		return new Rect(
			this.left.value,
			this.top.value,
			this.width.value,
			this.height.value
		) 
	}

}

