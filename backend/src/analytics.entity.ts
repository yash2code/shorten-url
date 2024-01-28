import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, VersionColumn } from 'typeorm';
import { ShortUrl } from './short-url.entity';

@Entity()
export class Analytics {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ShortUrl)
  shortUrl: ShortUrl;

  @Column()
  accessedAt: Date;

  @Column()
  accessCount: number;

  @VersionColumn()
  version: number;
}
