import { body } from "express-validator";

export const postCreateValidation = [
  body("title", "Введіть заголовок статті").isLength({ min: 3 }).isString(),
  body("text", "Введіть текст статті").isLength({ min: 10 }).isString(),
  body("tags", "Неправильний формат тегів").optional().isString(),
  body("imageUrl", "Вкажіть дійсне посилання").optional().isString(),
];
