import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { User } from '../../user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @Column()
  @ApiProperty()
  category: string;

  @Column()
  @ApiProperty()
  message: string;

  @Column({ nullable: true })
  @ApiProperty()
  webAppLocation: string;

  @Column({ nullable: true })
  @ApiProperty()
  mobileAppLocation: string;

  @Column({ default: false })
  @ApiProperty()
  read: boolean;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
