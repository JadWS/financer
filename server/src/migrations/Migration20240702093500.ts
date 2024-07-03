import { Migration } from '@mikro-orm/migrations';

export class Migration20240702093500 extends Migration {

  async up(): Promise<void> {
    this.addSql('create type "transaction_type" as enum (\'INCOME\', \'SUSBSCRIPTIONS\', \'HOME\', \'PLANNED_PAYMENTS\', \'PAYMENTS\');');
    this.addSql('create type "users" as enum (\'Jad\', \'Khaled\');');
    this.addSql('create table "category" ("id" serial primary key, "category" varchar(255) not null, "type" "transaction_type" not null);');

    this.addSql('create table "map" ("id" serial primary key, "original_category" varchar(255) not null, "dbcategory_id" int not null);');

    this.addSql('create table "transaction" ("id" serial primary key, "title" varchar(255) not null, "user" "users" not null, "category_id" int not null, "value" numeric(10,2) not null, "transaction_date" date not null);');

    this.addSql('alter table "map" add constraint "map_dbcategory_id_foreign" foreign key ("dbcategory_id") references "category" ("id") on update cascade;');

    this.addSql('alter table "transaction" add constraint "transaction_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade;');
  }

}
