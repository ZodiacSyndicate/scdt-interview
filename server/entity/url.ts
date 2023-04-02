import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Url {
    @PrimaryGeneratedColumn()
    id!: number;

    // 长链接
    @Column('text')
    url!: string;

    // 短连接
    @Column('text')
    keyword!: string;
}
