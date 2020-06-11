import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity("photos")
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    url: string;

    @Column()
    timestamp: string;

    @ManyToOne(type => User, user => user.photos)
    user: User;

}
