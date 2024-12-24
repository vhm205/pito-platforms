import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users', schema: 'auth' })
export class UserCustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email: string | null;

  @Column({ nullable: true, type: 'varchar' })
  encrypted_password: string | null;

  @Column({ nullable: true, type: 'varchar' })
  phone!: string | null;
}
