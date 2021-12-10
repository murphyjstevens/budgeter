CREATE DATABASE budgeter;

\connect "budgeter";

CREATE SEQUENCE account_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 2 CACHE 1;

CREATE TABLE "public"."account" (
    "id" integer DEFAULT nextval('account_id_seq') NOT NULL,
    "name" character varying(100) NOT NULL,
    "url" character varying(50) NOT NULL,
    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE SEQUENCE budget_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 17 CACHE 1;

CREATE TABLE "public"."budget" (
    "id" integer DEFAULT nextval('budget_id_seq') NOT NULL,
    "assigned" money NOT NULL,
    "date" date NOT NULL,
    "category_id" integer NOT NULL,
    CONSTRAINT "budget_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE SEQUENCE category_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 14 CACHE 1;

CREATE TABLE "public"."category" (
    "id" integer DEFAULT nextval('category_id_seq') NOT NULL,
    "name" character varying(100) NOT NULL,
    "sort_order" integer NOT NULL,
    "category_group_id" integer NOT NULL,
    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE SEQUENCE category_group_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 3 CACHE 1;

CREATE TABLE "public"."category_group" (
    "id" integer DEFAULT nextval('category_group_id_seq') NOT NULL,
    "name" character varying(100) NOT NULL,
    "sort_order" integer NOT NULL,
    CONSTRAINT "category_group_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE SEQUENCE recipient_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 7 CACHE 1;

CREATE TABLE "public"."recipient" (
    "id" integer DEFAULT nextval('recipient_id_seq') NOT NULL,
    "name" character varying(100) NOT NULL,
    CONSTRAINT "recipient_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE SEQUENCE transaction_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 11 CACHE 1;

CREATE TABLE "public"."transaction" (
    "id" integer DEFAULT nextval('transaction_id_seq') NOT NULL,
    "account_id" integer NOT NULL,
    "date" date NOT NULL,
    "cost" money NOT NULL,
    "category_id" integer,
    "recipient_id" integer NOT NULL,
    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
) WITH (oids = false);
