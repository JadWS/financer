import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Category } from "./Category";

@Entity()
export class Map {
    @PrimaryKey()
    id!: number;

    @Property()
    originalCategory!: string;

    @ManyToOne(() => Category)
    DBCategory!: Category;
}
