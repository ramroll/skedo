
import {  Dialect, Sequelize } from "sequelize";
import config from '@skedo/svc-config'

export default class DB{
	
	static sequelize : Sequelize

	static getSequelize() {
		if(!DB.sequelize) {
			console.log(config)
			DB.sequelize = new Sequelize(config.dbName, config.uname, config.passwd,  {
				host : config.dbHost,
				storage : config.storage,
				dialect : config.dbType as Dialect
			})
		}
		return DB.sequelize
	}
}