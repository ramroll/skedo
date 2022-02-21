type Unwrap<T> = T extends Promise<infer U> ? Unwrap<U> 
	: T extends Array<infer V> ?
		UnwrapArray<T> :
	T

type UnwrapArray<T> = T  extends Array<infer R>
	? { [P in keyof T] : Unwrap<T[P]> }
	: T

type T0 = Unwrap<Promise<Promise<number>>[]>
