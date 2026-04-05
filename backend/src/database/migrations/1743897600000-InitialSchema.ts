import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1743897600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "users_role_enum" AS ENUM ('user', 'admin')
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"        uuid              NOT NULL DEFAULT gen_random_uuid(),
        "email"     character varying NOT NULL,
        "password"  character varying NOT NULL,
        "firstname" character varying NOT NULL,
        "surname"   character varying NOT NULL,
        "role"      "users_role_enum" NOT NULL DEFAULT 'user',
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "listings" (
        "id"          uuid              NOT NULL DEFAULT gen_random_uuid(),
        "title"       character varying NOT NULL,
        "description" text,
        "userId"      uuid,
        CONSTRAINT "PK_listings" PRIMARY KEY ("id"),
        CONSTRAINT "FK_listings_user" FOREIGN KEY ("userId")
          REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "attachments" (
        "id"        uuid              NOT NULL DEFAULT gen_random_uuid(),
        "path"      character varying NOT NULL,
        "listingId" uuid,
        CONSTRAINT "PK_attachments" PRIMARY KEY ("id"),
        CONSTRAINT "FK_attachments_listing" FOREIGN KEY ("listingId")
          REFERENCES "listings"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id"      uuid              NOT NULL DEFAULT gen_random_uuid(),
        "title"   character varying NOT NULL,
        "message" character varying NOT NULL,
        "userId"  uuid,
        CONSTRAINT "PK_notifications" PRIMARY KEY ("id"),
        CONSTRAINT "FK_notifications_user" FOREIGN KEY ("userId")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "messages" (
        "id"           uuid NOT NULL DEFAULT gen_random_uuid(),
        "content"      text NOT NULL,
        "sender_id"    uuid,
        "recipient_id" uuid,
        CONSTRAINT "PK_messages" PRIMARY KEY ("id"),
        CONSTRAINT "FK_messages_sender"    FOREIGN KEY ("sender_id")
          REFERENCES "users"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_messages_recipient" FOREIGN KEY ("recipient_id")
          REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "favorites" (
        "id"        uuid NOT NULL DEFAULT gen_random_uuid(),
        "userId"    uuid,
        "listingId" uuid,
        CONSTRAINT "PK_favorites" PRIMARY KEY ("id"),
        CONSTRAINT "FK_favorites_user"    FOREIGN KEY ("userId")
          REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_favorites_listing" FOREIGN KEY ("listingId")
          REFERENCES "listings"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "favorites"`);
    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "attachments"`);
    await queryRunner.query(`DROP TABLE "listings"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "users_role_enum"`);
  }
}
