import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity("bookmarks")
export class Bookmark {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    name: string;

    @Column()
    url: string;

    @Column()
    timestamp: string;

    @ManyToOne(type => User, user => user.notes)
    user: User;

}
