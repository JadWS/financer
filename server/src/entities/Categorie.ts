import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Categorie {
    @PrimaryKey()
    id!: number;

    @Property()
    categorie!: string;

    @Enum({ items: () => TransactionTypeEnum, nativeEnumName: 'transaction_type' })
    type!: TransactionTypeEnum;
}

export enum TransactionTypeEnum {
    INCOME,
    EXPENSE
}