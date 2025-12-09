import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { EmailStatus } from  '../shared/enums/email-status.enum';

@Entity('emails')
export class Email {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 200 })
    subject: string;

    @Column('text')
    body: string;

    @Column( { type: 'varchar', length: 100 } )
    recipientEmail: string;

    @Column({
        type: 'enum',
        enum: EmailStatus,
        default: EmailStatus.PENDING,
    })
    status: EmailStatus;
    
    @Column({ type: 'uuid'})
    senderId: string;

    @ManyToOne(() => User, (user) => user.sentEmails)
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @Column({ type: 'timestamp', nullable: true })
    sentAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
