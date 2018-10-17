// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
  // import "core-js/fn/array.find"
  // ...
import util from 'util';
import crypto from 'crypto';
import _ from 'lodash';
import typeorm, { Entity, BeforeInsert, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import PassportOptions from './PassportOptions';

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
    await bcrypt.hash(this.password, saltRounds).then(hash => {
      this.password = hash;
    });
  }

  async validPassword(password: string) {
    const hashedPassword = this.password;
    return bcrypt.compare(password, hashedPassword).then(res => res);
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
