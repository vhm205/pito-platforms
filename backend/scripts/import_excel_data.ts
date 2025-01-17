import path from 'path';

import {
  DataSource,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import xlsx from 'xlsx';

@Entity({ name: 'catering_packages' })
export class CateringPackageEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', unique: true })
  name: string;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @ManyToMany(() => CateringPackageOptionEntity, option => option.packages, {
    cascade: true,
  })
  @JoinTable({
    name: 'packages_options',
    joinColumn: { name: 'package_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'option_id', referencedColumnName: 'id' },
  })
  options: CateringPackageOptionEntity[];
}

@Entity({ name: 'catering_package_options' })
export class CateringPackageOptionEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @ManyToMany(() => CateringPackageEntity, packageEntity => packageEntity.options)
  packages: CateringPackageEntity[];

  @Column({ type: 'varchar', default: 'active' })
  status: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

async function importData(filePath: string, dataSource: DataSource) {
  const cateringPackageRepository = dataSource.getRepository(CateringPackageEntity);
  const cateringPackageOptionRepository = dataSource.getRepository(CateringPackageOptionEntity);

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Read the first sheet
  const sheetData = xlsx.utils.sheet_to_json<any>(workbook.Sheets[sheetName]);

  await dataSource.transaction(async manager => {
    for (const row of sheetData) {
      const [packageName, ...options]: any = Object.values(row);

      if (!packageName.trim()) {
        continue;
      }

      let cateringPackage = await cateringPackageRepository.findOneBy({ name: packageName.trim() });

      if (!cateringPackage) {
        console.log('Creating new package!', packageName);
        const newCateringPackage = new CateringPackageEntity();
        newCateringPackage.name = packageName.trim();
        cateringPackage = await manager.save(newCateringPackage);
      }

      if (!options || options.length === 0) {
        console.log('No options found for package', packageName);
        continue;
      }

      for (const option of options) {
        const name = option.trim();

        const packageOption = await cateringPackageOptionRepository.findOne({
          where: { name },
          relations: ['packages'],
        });

        if (!packageOption) {
          console.log('Creating new package option!', name);

          const packageOptionEntity = new CateringPackageOptionEntity();
          packageOptionEntity.name = name;
          packageOptionEntity.status = 'active';
          packageOptionEntity.packages = [cateringPackage];

          await manager.save(packageOptionEntity);
          continue;
        }

        const packages = packageOption.packages;
        const existingPackage = packages.find(p => p.id === cateringPackage.id);
        console.log('----------------');

        if (existingPackage) {
          console.log(`Package ${packageName} already exists for option`, name);
          continue;
        }

        const newPackages = [...packages, cateringPackage];

        const packageOptionUpdate = new CateringPackageOptionEntity();
        packageOptionUpdate.id = packageOption.id;
        packageOptionUpdate.packages = newPackages;

        await manager.save(packageOptionUpdate);
      }
    }
  });

  console.log('Data import from Excel completed successfully!');
}

// Database Initialization
(async () => {
  const {
    PARTNER_DB_HOST,
    PARTNER_DB_PORT,
    PARTNER_DB_USER,
    PARTNER_DB_PASSWORD,
    PARTNER_DB_NAME,
  } = process.env;

  const dataSource = new DataSource({
    type: 'postgres',
    host: PARTNER_DB_HOST,
    port: +PARTNER_DB_PORT!,
    username: PARTNER_DB_USER,
    password: PARTNER_DB_PASSWORD,
    database: PARTNER_DB_NAME,
    entities: [CateringPackageEntity, CateringPackageOptionEntity],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('Database connected!');

    // Path to the uploaded file
    const filePath = path.join(__dirname, './excels/catering_packages.xlsx');
    console.log(`File path: ${filePath}`);

    await importData(filePath, dataSource);
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await dataSource.destroy();
  }
})();
