import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
     TypeOrmModule.forRootAsync({
         imports: [ConfigModule],
         inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'postgres',
                password: '',
                database: 'email_app',
                autoLoadEntities: true,
                synchronize: true,
                logging: false,
            }),
        }),
    ],          
})  
export class DatabaseModule {}
