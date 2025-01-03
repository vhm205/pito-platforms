// eslint-disable-next-line import/named
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreatePackageOptionsTable1735890133354 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'catering_package_options',
        columns: [
          // {
          //   name: 'id',
          //   type: 'uuid',
          //   isPrimary: true,
          //   isGenerated: true,
          //   generationStrategy: 'uuid',
          // },
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'package_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
            default: "'active'",
            enum: ['active', 'inactive'],
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add foreign key constraint
    await queryRunner.createForeignKey(
      'catering_package_options',
      new TableForeignKey({
        columnNames: ['package_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'catering_packages',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('catering_package_options', 'package_id');
    await queryRunner.dropTable('catering_package_options', true);
  }
}
