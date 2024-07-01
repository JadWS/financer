import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Categorie } from "./Categorie";

@Entity()
export class Map {
    @PrimaryKey()
    id!: number;

    @Property()
    originalCategorie!: string;

    @ManyToOne(() => Categorie)
    DBCategorie!: Categorie;
}
