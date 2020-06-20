import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './';

@Entity()
export class Music {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    name: string;

    @Column()
    url: string;

    @Column()
    duration: string;

    @Column()
    timestamp: string;

    @ManyToOne(type => User, user => user.music)
    user: User;

}
