import vine from '@vinejs/vine'

export const unidadeCreateValidator = vine.compile(
  vine.object({
    nome: vine.string().minLength(3).maxLength(255),
  })
)

export const unidadeUpdateValidator = vine.compile(
  vine.object({
    nome: vine.string().minLength(3).maxLength(255).optional(),
  })
)
