import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLocationCoordinatesToUsers1743897600005
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" ADD COLUMN "latitude" double precision
    `);
    await queryRunner.query(`
      ALTER TABLE "users" ADD COLUMN "longitude" double precision
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "longitude"
    `);
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "latitude"
    `);
  }
}
