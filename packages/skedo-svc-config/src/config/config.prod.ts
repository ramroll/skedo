import { ConfigAttributes } from "./ConfigAttributes";
import {resolve} from 'path'

const config : ConfigAttributes = {

	dbHost : "localhost",
	dbType : 'sqlite',
	dbName : "skedo",
	uname : 'root',
	passwd : '123456',
	storage : resolve(__dirname, 'skedo.db'),
	redisPort : 6379,
	redisHost : "127.0.0.1"

	
	

}

export default config