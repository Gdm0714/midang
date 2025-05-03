import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
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

  @ManyToOne(() => Project, (project) => project.images)
  project: Project;
}
