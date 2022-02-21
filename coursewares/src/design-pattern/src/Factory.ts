class Product {

  constructor(private name : string) {
  }

  public static createCar() {
    return new Product("car")
  } 

}

