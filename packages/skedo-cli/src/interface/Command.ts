import yargs from 'yargs'
export default interface Command{
	name : string
	desc : string
	format :string
	run : (argv : any) => Promise<void> 

}