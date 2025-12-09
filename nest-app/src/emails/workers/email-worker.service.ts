import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Worker } from 'worker_threads';
import { join } from 'path';
import { existsSync } from 'fs';
import { Email } from '../email.entity';
import { EmailStatus } from 'src/shared/enums/email-status.enum';

@Injectable()
export class EmailWorkerService {
  private readonly logger = new Logger(EmailWorkerService.name);

  constructor(
    @InjectRepository(Email)
    private emailRepository: Repository<Email>,
  ) {}

  async processEmail(emailId: string): Promise<void> {
    this.logger.log(`Starting email processing for email ID: ${emailId}`);

    // Build the absolue path to the worker
    const workerPath = join(process.cwd(), 'dist', 'emails', 'workers', 'email.worker.js');

    this.logger.log(`Worker path: ${workerPath}`);

    // Check if the worker file exists
    if (!existsSync(workerPath)) {
      this.logger.error(`Worker file not found at: ${workerPath}`);
      throw new Error(`Worker file not found at: ${workerPath}`);
    }

    return new Promise((resolve, reject) => {
      const worker = new Worker(workerPath, {
        workerData: { emailId }
      });

      worker.on('message', async (result) => {
        this.logger.debug(`Worker message received: ${JSON.stringify(result)}`);
        try {
          const email = await this.emailRepository.findOne({ 
            where: { id: emailId } 
          });

          if (!email) {
            this.logger.error(`Email ${emailId} not found in database`);
            return;
          }

          if (result.success) {
            email.status = EmailStatus.SENT;
            email.sentAt = new Date();
            this.logger.log(`Email ${emailId} marked as SENT`);
          } else {
            email.status = EmailStatus.FAILED;
            this.logger.error(`Email ${emailId} marked as FAILED: ${result.error}`);
          }
          
          await this.emailRepository.save(email);
          this.logger.log(`Email ${emailId} status updated to ${email.status}`);
          resolve();
        } catch (error) {
          this.logger.error(`Error updating email status: ${error.message}`, error.stack);
          reject(error);
        } finally {
          worker.terminate();
        }
      });

      worker.on('error', (error) => {
        this.logger.error(`Worker error for email ${emailId}: ${error.message}`, error.stack);
        this.updateEmailStatus(emailId, EmailStatus.FAILED)
          .finally(() => reject(error));
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          this.logger.warn(`Worker stopped with exit code ${code} for email ${emailId}`);
        }
      });
    });
  }

  private async updateEmailStatus(emailId: string, status: EmailStatus): Promise<void> {
    try {
      await this.emailRepository.update(emailId, { status });
      this.logger.log(`Updated email ${emailId} status to ${status}`);
    } catch (error) {
      this.logger.error(`Failed to update email status: ${error.message}`, error.stack);
    }
  }
}
