import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Project } from '../projects/project.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Project, (project) => project.category)
  projects: Project[];
}
