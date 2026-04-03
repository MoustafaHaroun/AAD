import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AttachmentModel,
  FavoriteModel,
  ListingModel,
  MessageModel,
  NotificationModel,
  UserModel,
} from '@/infrastructure/persistence/typeorm/models';

export default TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_NAME,
  entities: [
    AttachmentModel,
    FavoriteModel,
    ListingModel,
    MessageModel,
    NotificationModel,
    UserModel,
  ],
  synchronize: process.env.NODE_ENV === 'development',
});
