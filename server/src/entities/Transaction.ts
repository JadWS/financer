import { Entity, Enum, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Category } from "./Category";

@Entity()
export class Transaction {
    @PrimaryKey()
    id!: number;

    @Property()
    title!: string;

    @Enum({ items: () => UserEnum, nativeEnumName: 'users' })
    user!: UserEnum;

    @ManyToOne(() => Category)
    category!: Category;

    @Property({ type: 'decimal', precision: 10, scale: 2 })
    value!: number

    @Property({ type: "date" })
    transactionDate: Date
}

export enum UserEnum {
    JAD = 'Jad',
    KHALED = 'Khaled'
}