import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReadAndCreatedAtToNotifications1743897600006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "notifications" ADD COLUMN "read" BOOLEAN NOT NULL DEFAULT false
    `);
    await queryRunner.query(`
      ALTER TABLE "notifications" ADD COLUMN "created_at" TIMESTAMP NOT NULL DEFAULT now()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "notifications" DROP COLUMN "created_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "notifications" DROP COLUMN "read"
    `);
  }
}
