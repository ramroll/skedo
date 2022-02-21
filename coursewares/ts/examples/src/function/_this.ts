interface DB {
	exec(sql : string) : any
}

function runSql(this : DB, sql : string){
	this.exec(sql)
}
