import { PassportUserSchema } from "../../src/passport-local-typeorm";
import { Column, Entity } from "typeorm";

@Entity()
export class User extends PassportUserSchema {
    @Column()
    email: string
}