import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ListingModel } from '@/infrastructure/persistence/typeorm/models';
import { User } from '@/domain/entities';

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

  @OneToMany(() => ListingModel, (listing) => listing.user)
  listings: ListingModel[];

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
      listings: this.listings,
    } satisfies User;
  }
}
