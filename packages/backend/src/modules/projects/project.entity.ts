import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
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
  @JoinColumn({ name: 'categoryId' }) // 외래 키 컬럼 이름 명시
  category: Category;

  @Column({ nullable: true }) // categoryId 컬럼 추가
  categoryId: number;

  @OneToMany(() => Image, (image) => image.project, {
    cascade: true, // 변경 사항을 이미지에도 적용
  })
  images: Image[];
}
