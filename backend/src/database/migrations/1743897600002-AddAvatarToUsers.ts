import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAvatarToUsers1743897600002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" ADD COLUMN "avatar" character varying
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "avatar"
    `);
  }
}
