import { ApiProperty } from '@nestjs/swagger';
import { EmailStatus } from 'src/shared/enums/email-status.enum';

export class EmailResponseDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    id: string;

    @ApiProperty({ example: 'Hello from NestJS Email Service' })
    subject: string;

    @ApiProperty({ example: 'This is a test email sent from the NestJS email service.' })
    body: string;

    @ApiProperty({ example: 'friend@example.com' })
    recipientEmail: string;

    @ApiProperty({
        enum: EmailStatus,
        example: EmailStatus.PENDING,
    })
    status: EmailStatus;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    senderId: string;

    @ApiProperty({
        required: false,
        example: '2024-01-15T10:30:00.000Z',
    })
    sentAt: Date;

    @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
    createdAt: Date;
    
    @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
    updatedAt: Date;
    }
