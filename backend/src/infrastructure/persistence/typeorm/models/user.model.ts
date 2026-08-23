import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ListingModel } from '@/infrastructure/persistence/typeorm/models';
import { User } from '@/domain/entities';
import { NotificationModel } from './notification.model';
import { Role } from '@/domain/enums/role.enum';

@Entity('users')
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  firstname: string;

  @Column()
  surname: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ type: 'varchar', nullable: true })
  location: string | null;

  @Column({ type: 'double precision', nullable: true })
  latitude: number | null;

  @Column({ type: 'double precision', nullable: true })
  longitude: number | null;

  @Column({ type: 'varchar', nullable: true })
  avatar: string | null;

  @OneToMany(() => ListingModel, (listing) => listing.user)
  listings: ListingModel[];

  @OneToMany(() => NotificationModel, (notification) => notification.user)
  notifications: NotificationModel[];

  static fromDomain(this: void, user: User): UserModel {
    const model = new UserModel();

    model.id = user.id;
    model.firstname = user.firstname;
    model.email = user.email;
    model.surname = user.surname;
    model.listings = user.listings.map(ListingModel.fromDomain);

    return model;
  }

  toDomain(): User {
    return {
      id: this.id,
      email: this.email,
      firstname: this.firstname,
      surname: this.surname,
      role: this.role,
      location: this.location ?? null,
      latitude: this.latitude ?? null,
      longitude: this.longitude ?? null,
      avatar: this.avatar ?? null,
      listings: this.listings,
      notifications: this.notifications,
    } satisfies User;
  }
}
