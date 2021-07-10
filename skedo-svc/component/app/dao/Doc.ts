import {Model, DataTypes, Optional} from 'sequelize'
import Helper from './Helper'

interface DocAttributes {
	id : number,
	type : string,
	idx : string,
	doc : string
}

interface DocCreationAttributes extends Optional<DocAttributes, "id"> {}

class Doc extends Model<DocAttributes, DocCreationAttributes>{
	public id!:number
}

Doc.init({
	id : {
		type : DataTypes.INTEGER,
		autoIncrement :true,
		primaryKey : true
	},
	type : {
		type : DataTypes.STRING,
	},
	idx : {
		type : DataTypes.STRING,
		unique : true
	},
	doc: {
		type : DataTypes.JSON
	}

}, {
	sequelize : Helper.getSequelize(),
	modelName : "Doc",
	tableName : 'doc'
})


export default Doc
