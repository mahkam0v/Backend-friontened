import { ILike } from "typeorm"
import { AppDataSource } from "../config/data-source.js"
import { UserEntity } from "../models/user.entity.js"

const getUserRepository = () => AppDataSource.getRepository(UserEntity)

export const findUsers = async (filters = {}, page = 1, limit = 10) => {
  const userRepository = getUserRepository()
  const skip = (Number(page) - 1) * Number(limit)
  const take = Number(limit)

  return userRepository.find({
    where: filters,
    skip,
    take,
    select: {
      id: true,
      name: true,
      email: true,
      age: true,
      userImage: true,
      role: true,
      createdAt: true,
    }
  })
}

export const findAllUsers = async (filters = {}, page = 1, limit = 10) => {
  const userRepository = getUserRepository()
  const where = {}

  if (filters.age !== undefined) {
    where.age = Number(filters.age)
  }

  if (filters.name) {
    where.name = ILike(`%${filters.name}%`)
  }

  // Bug 5 fix: password ni qaytarmaslik uchun select qo'shildi
  return userRepository.find({
    where,
    order: { id: "DESC" },
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      age: true,
      userImage: true,
      role: true,
      createdAt: true,
    }
  })
}

export const findUserById = async (id) => {
  const userRepository = getUserRepository()
  return userRepository.findOne({
    where: { id },
  })
}

export const findUserByEmail = async (email) => {
  const userRepository = getUserRepository()
  return userRepository.findOne({
    where: { email: email.toLowerCase() },
  })
}

export const createUser = async (userData) => {
  const userRepository = getUserRepository()
  const newUser = userRepository.create({
    ...userData,
    email: userData.email.toLowerCase(),
  })

  return userRepository.save(newUser)
}

export const deleteUserById = async (id) => {
  const userRepository = getUserRepository()
  const userToDelete = await userRepository.findOneBy({ id })

  if (!userToDelete) {
    return null
  }

  return userRepository.remove(userToDelete)
}

export const findUserByTelegramChatId = async (telegramChatId) => {
  const userRepository = getUserRepository()
  return userRepository.findOneBy({ telegramChatId: String(telegramChatId) })
}

export const findAllUserChatId = async () => {
  const userRepository = getUserRepository()
  return userRepository.find({ order: { telegramChatId: "DESC" } })
}

export const createUserFromBot = async ({ name, email, telegramChatId }) => {
  const userRepository = getUserRepository()
  const user = userRepository.create({
    name,
    email,
    telegramChatId: String(telegramChatId),
    password: "telegram-user",
    role: "user",
  })

  return userRepository.save(user)
}
