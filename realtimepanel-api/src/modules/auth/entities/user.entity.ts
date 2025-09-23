import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MinLength } from 'class-validator';

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true })
    job: string;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({default: false})
    isAdmin: boolean;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: false, unique: true})
    email: string;
    
    @Column()
    @MinLength(6)
    password?: string;

    @Column({ default: null, type: 'simple-array' })
    access: string[];

}
