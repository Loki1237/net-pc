import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Conversation, User } from './';

@Entity("messages")
export class Message {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column()
    wasRead: boolean;

    @Column()
    timestamp: string;

    @ManyToOne(type => User, { nullable: false })
    author: User;

    @ManyToOne(type => Conversation, { nullable: false })
    conversation: Conversation;

}
