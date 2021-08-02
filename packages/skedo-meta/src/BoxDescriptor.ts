import { BoxDescriptorInput, SizeUnit } from "./standard.types"


export function sizeUnitToString(unit : SizeUnit){
	return unit.isAuto ? 
		"" : unit.value + unit.unit
}

export function sizeUnitToNumber(key : string, size : SizeUnit, maxWidth : number, maxHeight : number) : number {
	if(size.isAuto) {
		return 0
	}
	if(size.unit === 'px') {
		return size.value
	}
	else if(size.unit === '%'){
		if(['marginTop', 'marginBottom', 'top', 'height'].indexOf(key) !== -1) {
			return Math.round(maxHeight* size.value / 100)
		}
		else {

			return Math.round(maxWidth* size.value / 100)
		}
	}
	throw new Error("invalid sizeunit.")
}

export function parseSizeUnit(ipt : string | number | undefined) : SizeUnit{
	if(typeof ipt === 'undefined' || ipt === '' || ipt === 'px') {
		return {
			value : 0,
			unit : 'px',
			isAuto : true
		}
	}
	if(typeof ipt === 'number') {
		return {
			value : ipt,
			unit : 'px',
			isAuto : false
		}
	}
	if(typeof ipt === 'string') {
		
		if(ipt.match(/^\d+(px|%)$/)) {
			let num = Number.parseFloat(ipt.replace(/(px | %)/, ""))
			const m = ipt.match(/(px|%)/)
			const unit = m?m[0] : "px"
			if(isNaN(num)) {
				num = 0	
			}
			return {
				value : num,
				// @ts-ignore
				unit,
				isAuto : false
			}
		}

		const val = Number.parseFloat(ipt)
		if(!isNaN(val)) {
			return {
				value : val,
				unit : 'px',
				isAuto : false
			}
		}

	}
	throw new Error("Unrecognizable size input:" + ipt)
}


export function boxDescriptor(box : BoxDescriptorInput){

	if(box.mode === 'fill') {
		return {
			mode : box.mode,
      left: parseSizeUnit(0),
      top: parseSizeUnit(0),
      width: parseSizeUnit('100%'),
      height: parseSizeUnit("100%"),
      marginLeft: parseSizeUnit(box.marginLeft),
      marginRight: parseSizeUnit(box.marginRight),
      marginBottom: parseSizeUnit(box.marginBottom),
      marginTop: parseSizeUnit(box.marginTop),
    }
	}

	return {
		mode : 'normal',
		left : parseSizeUnit( box.left ),
		top : parseSizeUnit( box.top ),
		width : parseSizeUnit( box.width ),
		height : parseSizeUnit(box.height),
		marginLeft : parseSizeUnit(box.marginLeft),
		marginRight : parseSizeUnit(box.marginRight),
		marginBottom : parseSizeUnit(box.marginBottom),
		marginTop : parseSizeUnit(box.marginTop),
	}
}

