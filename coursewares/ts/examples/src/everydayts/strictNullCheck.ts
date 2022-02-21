function doSomething(x: string | null) {
  console.log("Hello, " + x!.toUpperCase());
}