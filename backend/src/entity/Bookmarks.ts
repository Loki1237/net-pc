import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bookmarks {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    name: string;

    @Column()
    url: string;

}
