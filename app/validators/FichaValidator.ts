import vine from '@vinejs/vine'

export const fichaCreateValidator = vine.compile(
  vine.object({
    nome: vine.string().trim().minLength(3).maxLength(255),
    custoTotal: vine.number().min(0),
    qtdRendimento: vine.number().min(0),
    valorRendimento: vine.number().min(0),
    valorVenda: vine.number().min(0),
    cmvReal: vine.number().min(0),
    lucroReal: vine.number().min(0),
  })
)
