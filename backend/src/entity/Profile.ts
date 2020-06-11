import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from './User';

@Entity("profiles")
export class Profile {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    gender: string;

    @Column()
    birthday: string;

    @Column()
    country: string;

    @Column()
    city: string;

    @Column()
    familyStatus: string;

    @Column()
    activity: string;

    @Column()
    interests: string;

    @Column()
    hobby: string;

    @Column()
    aboutSelf: string;

    @OneToOne(type => User, user => user.profile)
    user: User;

}
