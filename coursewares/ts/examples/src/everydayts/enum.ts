enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}

console.log(Direction[Direction.Up])

enum E {
  X,
  Y,
  Z,
}

function f(obj: { X: number }) {
  return obj.X;
}

f(E)