import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ProjectStatus } from '@architecture-firm/shared/dist/types/project';
import { Category } from '../categories/category.entity';
import { Image } from '../images/image.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  location: string;

  @Column()
  client: string;

  @Column()
  year: number;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PLANNING,
  })
  status: string;

  @ManyToOne(() => Category, (category) => category.projects)
  category: Category;

  @OneToMany(() => Image, (image) => image.project)
  images: Image[];
}
