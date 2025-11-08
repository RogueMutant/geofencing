import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GeofenceMiddleware } from './middleware/geofence.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, cache: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GeofenceMiddleware).forRoutes('*');
  }
}
