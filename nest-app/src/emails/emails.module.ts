import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailsController} from './emails.controller'
import { EmailsService } from './emails.service';
import { EmailWorkerService } from './workers/email-worker.service';
import { Email } from './email.entity'
import { UsersModule} from 'src/users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Email]),
        UsersModule,
    ],
    controllers: [EmailsController],
    providers: [EmailsService, EmailWorkerService],
})
export class EmailsModule {}

