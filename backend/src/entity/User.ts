import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, OneToMany, JoinColumn, ManyToMany } from 'typeorm';
import { Friend, Bookmark, Note, Profile, Music, Photo, Conversation, Message } from './';

@Entity("users")
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    avatar: string;

    @Column()
    online: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @OneToOne(type => Profile, profile => profile.user, { nullable: false })
    @JoinColumn()
    profile: Profile;

    @ManyToMany(type => Conversation, conversation => conversation.participants)
    conversations: Conversation[];

    @OneToMany(type => Message, message => message.author)
    messages: Message[];

    @OneToMany(type => Friend, friendRequest => friendRequest.user1)
    friends: Friend[];

    @OneToMany(type => Music, track => track.user)
    music: Music[];

    @OneToMany(type => Photo, photo => photo.user)
    photos: Photo[];

    @OneToMany(type => Bookmark, bookmark => bookmark.user)
    bookmarks: Bookmark[];

    @OneToMany(type => Note, note => note.user)
    notes: Note[];

}
