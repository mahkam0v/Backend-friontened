import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { UserEntity } from "../models/user.entity.js"
import { TodoEntity } from "../models/todo.entity.js"
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,  // ← bitta URL yetarli!
  ssl: {
    rejectUnauthorized: false  // ← Railway uchun SHART!
  },
  synchronize: true,
  logging: false,
  entities: [UserEntity, TodoEntity],
});