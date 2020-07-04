import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User, Music } from './';

@Entity("playlists")
export class Playlist {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    discription: string;

    @Column()
    timestamp: string;

    @ManyToOne(type => User, user => user.playlists)
    user: User;

    @ManyToMany(type => Music)
    @JoinTable()
    music: Music[]

}
