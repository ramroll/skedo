export interface ConfigAttributes {

	dbHost : string,
	dbType : string,
	dbName : string,
	uname : string,
	passwd : string,
	// sqlite only
	storage? : string,
	redisPort : number,
	redisHost : string
}