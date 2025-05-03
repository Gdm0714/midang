import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from '../projects/project.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isFeatured: boolean;

  @ManyToOne(() => Project, (project) => project.images, {
    onDelete: 'CASCADE', // 프로젝트 삭제 시 이미지도 자동 삭제
  })
  @JoinColumn({ name: 'projectId' }) // 외래 키 컬럼 이름 명시
  project: Project;

  @Column({ nullable: true }) // 프로젝트 ID 컬럼 추가
  projectId: number;
}
