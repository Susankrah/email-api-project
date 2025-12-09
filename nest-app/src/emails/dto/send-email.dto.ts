import {IsEmail, IsString,IsUUID, MinLength, MaxLength} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class SendEmailDto {

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000', 
        description: 'Sender user ID'})

    @IsUUID()
    senderId: string;

    @ApiProperty({
        example: 'friend@example.com',
        description: 'Recipient email address'})
    @IsEmail()
    recipientEmail: string;

    @ApiProperty({
        example: 'Hello from NestJS Email Service',
        description: 'Email subject'})
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    subject: string;
   
   @ApiProperty({
       example: 'This is a test email sent from the NestJS email service.',
         description: 'Email body'})
    @IsString()
    @MinLength(1)
    body: string;
    }
