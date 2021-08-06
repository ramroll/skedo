import yargs from 'yargs'
export default interface Command{
	name : string
	format :string
	run : (argv : any) => Promise<void> 

}