import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Email } from "./email.entity";
import { UsersService } from "../users/users.service";
import { SendEmailDto } from "./dto/send-email.dto";
import { EmailStatus } from "src/shared/enums/email-status.enum";
import { EmailWorkerService } from "./workers/email-worker.service";
import { EmailResponseDto } from "./dto/email-response.dto";

@Injectable()
export class EmailsService {
    constructor(
        @InjectRepository(Email)
        private emailRepository: Repository<Email>,
        private usersService: UsersService,
        private emailWorkerService: EmailWorkerService,
    ) {}

    async sendEmail(sendEmailDto: SendEmailDto): Promise<EmailResponseDto> {
        // verify sender exists
        try {
            await this.usersService.findOne(sendEmailDto.senderId);
        } catch (error) {
            throw new BadRequestException(`Sender with ID ${sendEmailDto.senderId} not found`);
        }

        const email = this.emailRepository.create({
            ...sendEmailDto,
            status: EmailStatus.PENDING,
        });

        const savedEmail = await this.emailRepository.save(email);
         
        // Process email sending asynchronously using worker thread 
        this.emailWorkerService.processEmail(savedEmail.id)
            .catch((error) => {
                console.error(`Failed to process email ${savedEmail.id}: ${error.message}`);
            });

        return {
            id: savedEmail.id,
            subject: savedEmail.subject,
            body: savedEmail.body,
            recipientEmail: savedEmail.recipientEmail,
            status: savedEmail.status,
            senderId: savedEmail.senderId,
            sentAt: savedEmail.sentAt,
            createdAt: savedEmail.createdAt,
            updatedAt: savedEmail.updatedAt,
        };
    }
   
    async getSentEmails(userId: string): Promise<EmailResponseDto[]> {

        // verify if user exits 
        try {
            await this.usersService.findOne(userId);
        } catch (error) {
            throw new NotFoundException(`User with ID not found`);
        }

        const emails = await this.emailRepository.find({
            where: { senderId: userId },
            order: { createdAt: 'DESC' },
        });

        return emails.map((email) => ({
            id: email.id,
            subject: email.subject,
            body: email.body,
            recipientEmail: email.recipientEmail,
            status: email.status,
            senderId: email.senderId,
            sentAt: email.sentAt,
            createdAt: email.createdAt,
            updatedAt: email.updatedAt,
        }));
    }
}   
