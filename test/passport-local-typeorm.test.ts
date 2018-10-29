import "reflect-metadata";
import { createConnection, Connection, Repository, getRepository } from 'typeorm'
import { PassportUserSchema } from '../src/passport-local-typeorm';
import PassportOptions  from '../src/PassportOptions';
import { User } from "./entity/user.entity";

let userRepository
const initDB = async () => {
  const options = new PassportOptions("users", "username");
  const connection = await createConnection({
    name: 'default',
    type: 'sqlite',
    database: 'test/temp/sqlitedb.db',
    synchronize: true,
    entities: [User]
  })
  userRepository = getRepository(User)
}

describe("Test Passwport User", () => {
  beforeAll(() => {
    return initDB();
  });

  /*afterEach(() => {
    userRepository.query('delete * from user')
  }) */

  it("works if true is truthy", () => {
    expect(true).toBeTruthy()
  })

  test("check of valid PasportOptions", () => {
    const options = new PassportOptions('users', 'username')
    expect(options).toBeDefined()
  })

  test("Passwords Should Validate", async () => {
    const userInstance = new User();
    userInstance.email = "none@none.com";
    userInstance.username = "Bob";
    userInstance.password = "dragonBall7_";
    userInstance.verified = true;
    const user: User = await userRepository.save(userInstance);
    expect(user.validPassword('dragonBall7_')).toBeTruthy();
  })

  test('Passwords Should Not Validate', async () => {
    const userInstance = new User()
    userInstance.email = 'none@none.com'
    userInstance.username = 'Bob'
    userInstance.password = 'dragonBall7_'
    userInstance.verified = true
    const user: User = await userRepository.save(userInstance)
    expect(user.validPassword("KingOfTheKill")).toBeFalsy();
  })
})
