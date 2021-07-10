import {  Sequelize } from "sequelize";

export default class Helper{
	
	static sequelize : Sequelize

	static getSequelize() {
		if(!Helper.sequelize) {
			Helper.sequelize = new Sequelize("skedo", "root", "123456", {
				host : "192.168.199.128",
				dialect : "mysql"
			})
		}
		return Helper.sequelize
	}
}