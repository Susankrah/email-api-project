import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  //Swagger configuration 
  const config = new DocumentBuilder()
    .setTitle('Email API Service')
    .setDescription('API for sending asychronously using worker threads')
    .setVersion('1.0')
    .addTag('Emails')
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://*.ngrok.io',
      'https://*.ngrok-free.app',
      'http://*.ngrok.io',
      'http://*.ngrok-free.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,

});

    const port = process.env.PORT || 3000;
    await app.listen(port);


    app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

}
bootstrap();
















