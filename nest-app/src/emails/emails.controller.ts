import {Controller, Post, Get, Body, Param} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse,ApiParam } from "@nestjs/swagger";
import { EmailsService } from './emails.service';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailResponseDto } from './dto/email-response.dto';

@ApiTags ('Emails')
@Controller('api/emails')
export class EmailsController {
    constructor( private readonly emailService: EmailsService) {}


   @Post('send')
   @ApiOperation({ summary: 'Send email asynchronously'})
   @ApiResponse({
     status:201,
     description: 'Email queued for sending',
     type:EmailResponseDto
   })

   async sendEmail(@Body() SendEmailDto: SendEmailDto):Promise<EmailResponseDto> 
   {
     return this.emailService.sendEmail( SendEmailDto);
   }
 
   @Get ('sent/:userId')
   @ApiOperation({ summary: 'Get all emails sentby a user '})
   @ApiParam({
    name:'userId',
    description: 'User ID',
    example: 'd3frasssddn432-34edr-4esdf-8gbhhh5e7hhj2c'
   })

   @ApiResponse({
    status:200,
    description:'List of sent emails',
    type: [EmailResponseDto] 
   })
  
   async getSentEmails(@Param('userId') userId: string): Promise<EmailResponseDto[]> 
   {
     return this.emailService.getSentEmails(userId);

   }
}



