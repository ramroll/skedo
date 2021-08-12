import { BoxDescriptorInput, SizeUnit } from "./standard.types"


export function sizeUnitToString(unit : SizeUnit){
	return unit.isAuto ? 
		"" : unit.value + unit.unit
}

export function sizeUnitToNumber(
  key: string,
  size: SizeUnit,
  maxWidth: number,
  maxHeight: number
): number {
  if (size.isAuto) {
    return 0
  }
  if (size.unit === "px") {
    return size.value
  } else if (size.unit === "%") {
    if (
      [
        "marginTop",
        "marginBottom",
        "top",
        "height",
      ].indexOf(key) !== -1
    ) {
      return Math.round((maxHeight * size.value) / 100)
    } else {
      return Math.round((maxWidth * size.value) / 100)
    }
  }
  throw new Error("invalid sizeunit.")
}

type Unit = 'px' | '%'
class SizeUnit{

	value : number = 0
	unit : Unit = 'px'
	isAuto : boolean 
	constructor(value : number, unit : Unit, isAuto : boolean) {
		this.value = value
		this.unit = unit
		this.isAuto = isAuto
	}

	public toNumber(key: string,
		size: SizeUnit,
		maxWidth: number,
		maxHeight: number){
	  if (size.isAuto) {
			return 0
		}
		if (size.unit === "px") {
			return size.value
		} else if (size.unit === "%") {
			if (
				[
					"marginTop",
					"marginBottom",
					"top",
					"height",
				].indexOf(key) !== -1
			) {
				return Math.round((maxHeight * size.value) / 100)
			} else {
				return Math.round((maxWidth * size.value) / 100)
			}
		}
		throw new Error("invalid sizeunit.")	
	}

	static parse(ipt : string | number | undefined) : SizeUnit{
		if(typeof ipt === 'undefined' || ipt === '' || ipt === 'px') {
			return new SizeUnit(0, 'px', true)
		}
		if(typeof ipt === 'number') {
			return new SizeUnit(ipt, 'px', false)
		}
		if(typeof ipt === 'string') {
			
			if(ipt.match(/^\d+(px|%)$/)) {
				let num = Number.parseFloat(ipt.replace(/(px | %)/, ""))
				const m = ipt.match(/(px|%)/)
				const unit = m?m[0] : "px"
				if(isNaN(num)) {
					num = 0	
				}
				return new SizeUnit(num, unit as Unit, false)
			}
	
			const val = Number.parseFloat(ipt)
			if(!isNaN(val)) {
				return new SizeUnit(val, 'px', false)
			}
	
		}
		throw new Error("Unrecognizable size input:" + ipt)
	}
}

export class BoxDescriptor {
	mode : string
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
		this.left = SizeUnit.parse(0)
		this.top = SizeUnit.parse(0)
		if(this.mode === 'fill') {
			this.width = SizeUnit.parse('100%')
			this.height = SizeUnit.parse("100%")
		} else {
			this.width = SizeUnit.parse(box.width)
			this.height = SizeUnit.parse(box.height)
		}
		this.marginLeft = SizeUnit.parse(box.marginLeft)
		this.marginRight = SizeUnit.parse(box.marginRight)
		this.marginBottom = SizeUnit.parse(box.marginBottom)
		this.marginTop = SizeUnit.parse(box.marginTop)
	}
}

