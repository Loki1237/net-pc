import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { Conversation, User } from './';

@Entity("messages")
export class Message {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column()
    wasRead: boolean;

    @CreateDateColumn()
    timestamp: Date;

    @ManyToOne(type => User, { nullable: false })
    author: User;

    @ManyToOne(type => Conversation, { nullable: false })
    conversation: Conversation;

}
