import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategoryAndTypeToListings1743897600003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "listings_category_enum" AS ENUM (
        'moving', 'cooking', 'gardening', 'carpentry', 'childcare',
        'cleaning', 'tutoring', 'tech_help', 'pet_care', 'other'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "listings_type_enum" AS ENUM ('offer', 'request')
    `);
    await queryRunner.query(`
      ALTER TABLE "listings"
      ADD COLUMN "category" "listings_category_enum" NOT NULL DEFAULT 'other'
    `);
    await queryRunner.query(`
      ALTER TABLE "listings"
      ADD COLUMN "type" "listings_type_enum" NOT NULL DEFAULT 'offer'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "type"`);
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "category"`);
    await queryRunner.query(`DROP TYPE "listings_type_enum"`);
    await queryRunner.query(`DROP TYPE "listings_category_enum"`);
  }
}
