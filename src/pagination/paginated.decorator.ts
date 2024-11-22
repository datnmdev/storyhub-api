import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

export interface IEdgeType<T> {
  cursor: number;
  node: T;
}

export interface IPaginatedType<T> {
  edges: IEdgeType<T>[];
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

export function createPaginatedEntity<T>(entity: new () => T): { EdgeEntity: any; PaginatedEntity: any } {
  @Entity(`${entity.name}Edge`)
  class EdgeEntity implements IEdgeType<T> {
    @Column()
    cursor: number;

    @ManyToOne(() => entity, { eager: true })
    node: T;
  }

  @Entity(`${entity.name}Paginated`)
  class PaginatedEntity implements IPaginatedType<T> {
    @Column(() => EdgeEntity)
    edges: EdgeEntity[];

    @Column()
    totalCount: number;

    @Column({ default: false })
    hasNextPage: boolean;

    @Column({ default: false })
    hasPreviousPage: boolean;

    @Column({ nullable: true })
    startCursor: string;

    @Column({ nullable: true })
    endCursor: string;
  }

  return { EdgeEntity, PaginatedEntity };
}
