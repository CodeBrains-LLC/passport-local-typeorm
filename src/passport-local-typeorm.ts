// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
  // import "core-js/fn/array.find"
  // ...
import util from 'util';
import crypto from 'crypto';
import _ from 'lodash';
import typeorm, { Entity, BeforeInsert, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';

// The default option values
const defaultAttachOptions = {
  activationkeylen: 8,
  resetPasswordkeylen: 8,
  saltlen: 32,
  iterations: 12000,
  keylen: 512,
  digest: 'sha1',
  usernameField: 'username',
  usernameLowerCase: false,
  activationRequired: false,
  hashField: 'hash',
  saltField: 'salt',
  activationKeyField: 'activationKey',
  resetPasswordKeyField: 'resetPasswordKey',
  incorrectPasswordError: 'Incorrect password',
  incorrectUsernameError: 'Incorrect username',
  invalidActivationKeyError: 'Invalid activation key',
  invalidResetPasswordKeyError: 'Invalid reset password key',
  missingUsernameError: 'Field %s is not set',
  missingFieldError: 'Field %s is not set',
  missingPasswordError: 'Password argument not set!',
  userExistsError: 'User already exists with %s',
  activationError: 'Email activation required',
  noSaltValueStoredError: 'Authentication not possible. No salt value stored in db!'
};

export class PassportUserSchema extends BaseEntity {
  options: object
  constructor(options: object = defaultAttachOptions) {
    super()
    this.options = options
  }
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  hash: string

  @Column()
  salt: string

  @Column()
  activationKey: string

  @Column()
  restorePasswordKey: string

  @Column()
  verified: boolean

  secondPassword: string

  validPassword(password: string, hashedPassword: string) {
    return bcrypt.compareSync(password, hashedPassword);
  }
  
  @BeforeInsert()
  updateDates() {
    this. = new Date();
  }
}

