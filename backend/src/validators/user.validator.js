import Joi from "joi"

// Bug 7 fix: role faqat "user" bo'lishi mumkin, "admin" ro'yxatdan o'tishda tanlana olmaydi
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  age: Joi.number().min(0).max(120).optional(),
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

// Admin tomonidan user yaratishda role tanlash mumkin
export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  age: Joi.number().min(0).max(120).optional(),
  userImage: Joi.string().optional(),
  role: Joi.string().valid("admin", "user").optional(),
})
