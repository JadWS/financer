import { Migration } from '@mikro-orm/migrations';

export class Migration20240630150026 extends Migration {

  async up(): Promise<void> {
    this.addSql('create type "transaction_type" as enum (\'0\', \'1\');');
    this.addSql('create type "users" as enum (\'0\', \'1\');');
    this.addSql('create table "categorie" ("id" serial primary key, "categorie" varchar(255) not null, "type" "transaction_type" not null);');

    this.addSql('create table "map" ("id" serial primary key, "original_categorie" varchar(255) not null, "dbcategorie_id" int not null);');

    this.addSql('create table "transaction" ("id" serial primary key, "title" varchar(255) not null, "user" "users" not null, "categorie_id" int not null, "transaction_date" date not null);');

    this.addSql('alter table "map" add constraint "map_dbcategorie_id_foreign" foreign key ("dbcategorie_id") references "categorie" ("id") on update cascade;');

    this.addSql('alter table "transaction" add constraint "transaction_categorie_id_foreign" foreign key ("categorie_id") references "categorie" ("id") on update cascade;');
  }

}
