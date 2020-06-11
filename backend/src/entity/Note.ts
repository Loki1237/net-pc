import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity("notes")
export class Note {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    header: string;

    @Column()
    content: string;

    @Column()
    timestamp: string;

    @ManyToOne(type => User, user => user.notes)
    user: User;

}
