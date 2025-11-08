import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GeofenceMiddleware } from './middleware/geofence.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GeofenceMiddleware).forRoutes('*');
  }
}
