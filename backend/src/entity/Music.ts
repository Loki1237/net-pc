import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Music {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    artist: string;

    @Column()
    name: string;

    @Column()
    url: string;

    @Column()
    duration: string;

    @Column()
    timestamp: string;

}
