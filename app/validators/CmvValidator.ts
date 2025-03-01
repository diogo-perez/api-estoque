import vine from '@vinejs/vine'

export const CreateCMVValidator = vine.compile(
  vine.object({
    nome: vine.string(),
    faturamento: vine.number(),
    valorCMV: vine.number(),
    unidadeId: vine.number().exists({ table: 'unidade', column: 'id' }),
  })
)

export const UpdateCMVValidator = vine.compile(
  vine.object({
    nome: vine.string().optional(),
    faturamento: vine.number().optional(),
    valorCMV: vine.number().optional(),
    isAtivo: vine.boolean().optional(),
  })
)
