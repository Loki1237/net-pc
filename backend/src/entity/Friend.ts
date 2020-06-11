import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity("friends")
export class Friend {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user1Id: number;

    @Column()
    user2Id: number;

    @Column()
    confirmed: boolean;

    @CreateDateColumn()
    timestamp: Date;

    @ManyToOne(type => User, user => user.friends)
    @JoinColumn()
    user1: User;

    @ManyToOne(type => User, user => user.friends)
    @JoinColumn()
    user2: User;

}
