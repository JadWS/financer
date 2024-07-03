import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Category {
    @PrimaryKey()
    id!: number;

    @Property()
    category!: string;

    @Enum({ items: () => TransactionTypeEnum, nativeEnumName: 'transaction_type' })
    type!: TransactionTypeEnum;
}

export enum TransactionTypeEnum {
    INCOME = 'INCOME',
    SUSBSCRIPTIONS = 'SUSBSCRIPTIONS',
    HOME = 'HOME',
    PLANNED_PAYMENTS = 'PLANNED_PAYMENTS',
    PAYMENTS = 'PAYMENTS'
}
