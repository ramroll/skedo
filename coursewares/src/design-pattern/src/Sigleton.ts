export class Db {

  private static db : Db

  public static getDB(){
    if(!Db.db) {
      Db.db = new Db()
    }
    return Db.db
  }

  private constructor(){
  }
}