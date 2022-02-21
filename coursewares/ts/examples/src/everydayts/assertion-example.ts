type Fish = { swim: () => void };
type Bird = { fly: () => void };

const fish : Fish = {
	swim : () => {
		console.log("swimming")
	}
}

const bird : Bird = {
	fly : () => {
		console.log("flying")
	}
}

function isFish(pet: Fish | Bird) : pet is Fish {
  return (pet as Fish).swim !== undefined;
}

if(isFish(bird)) {
	bird.swim()
}
