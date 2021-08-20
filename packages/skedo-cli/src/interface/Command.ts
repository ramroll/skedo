import yargs from 'yargs'
export default interface Command{
	name : string
	run : (argv : any) => Promise<void> 

}
