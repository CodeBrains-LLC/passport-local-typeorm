// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
  // import "core-js/fn/array.find"
  // ...
import typeorm, { BeforeInsert, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import { Strategy } from 'passport-local';
import PassportOptions from './PassportOptions';
let bcrypt = require('bcryptjs')

export abstract class PassportUserSchema extends BaseEntity {
  findByUsername: Promise<PassportUserSchema>;
  static createStrategy: () => Strategy;
  static findByUsername: (username: string) => Promise<PassportUserSchema>;
  static authenticate: () => (username: any, password: any, cb: any) => void;
  
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  password: string

  @Column()
  verified: boolean

  @BeforeInsert()
  async hashPassword() {
    const saltRounds = 10;
    let password = this.password
    this.password = bcrypt.hashSync(this.password, saltRounds)
    /*await bcrypt.hash(password, saltRounds).then(hash => {
      this.password = hash;
    });*/
  }

  async validPassword(passwordInput: string) {
    const hashedPassword = this.password;
    console.log(`The password Input is ${passwordInput} and the hash is ${hashedPassword}`)
    console.log(`The hashed password is ${hashedPassword}`)
    const result = await bcrypt.compare(passwordInput, hashedPassword)
    return result;
  }

  static attachToUser = (options: PassportOptions) => {

    PassportUserSchema.findByUsername = (username: string) =>{
      const whereClause = `${options.tableName}.${options.usernameField} = :username`;
      const user = PassportUserSchema.createQueryBuilder(`${options.tableName}`)
              .where(whereClause, { username })
              .getOne();
      return user;
    }

    PassportUserSchema.authenticate = () => {
      return (username, password, cb) => {
        PassportUserSchema.findByUsername(username).then(user => {
          if(user !== undefined){
            return user.validPassword(password);
          } else {
            return cb(null, false, { message: "Incorrect Password" });
          }
        });
     }
    }

    PassportUserSchema.createStrategy = () => {
      return new Strategy(options, PassportUserSchema.authenticate());
    };
  }
}

