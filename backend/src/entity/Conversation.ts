import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User, Message } from './';

@Entity("conversations")
export class Conversation {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    creatorId: number;

    @Column()
    isDialog: boolean;

    @Column()
    name: string;

    @CreateDateColumn()
    timestamp: Date;

    @OneToMany(type => Message, message => message.conversation)
    messages: Message[];

    @ManyToMany(type => User, user => user.conversations)
    @JoinTable()
    participants: User[];

}
