import { Entity, Enum, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Categorie } from "./Categorie";

@Entity()
export class Transaction {
    @PrimaryKey()
    id!: number;

    @Property()
    title!: string;

    @Enum({ items: () => UserEnum, nativeEnumName: 'users' })
    user!: UserEnum;

    @ManyToOne(() => Categorie)
    categorie!: Categorie;

    @Property({ type: "date" })
    transactionDate: Date
}

export enum UserEnum {
    JAD,
    KHALED
}