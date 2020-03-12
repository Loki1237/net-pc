import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    gender: string;

    @Column()
    birthday: string;

    @Column()
    country: string;

    @Column()
    city: string;

    @Column()
    family_status: string;

    @Column()
    avatar: string;

    @Column()
    status: string;

}
