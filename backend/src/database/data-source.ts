import 'dotenv/config';
import { DataSource } from 'typeorm';
import { AttachmentModel } from '../infrastructure/persistence/typeorm/models/attachment.model';
import { FavoriteModel } from '../infrastructure/persistence/typeorm/models/favorite.model';
import { ListingModel } from '../infrastructure/persistence/typeorm/models/listing.model';
import { MessageModel } from '../infrastructure/persistence/typeorm/models/message.model';
import { NotificationModel } from '../infrastructure/persistence/typeorm/models/notification.model';
import { UserModel } from '../infrastructure/persistence/typeorm/models/user.model';

export const AppDataSource = new DataSource({
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
  migrations: ['src/database/migrations/*.ts'],
});
