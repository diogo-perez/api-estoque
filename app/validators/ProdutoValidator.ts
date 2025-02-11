import vine from '@vinejs/vine'

export const produtoCreateValidator = vine.compile(
  vine.object({
    nome: vine.string().minLength(3).maxLength(255),
    qtdMin: vine.number(),
    quantidade: vine.number(),
    rendimento: vine.number(),
    valor: vine.number(),
    valorReajuste: vine.number().optional(),
    dataReajuste: vine
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    unidadeMedida: vine.number(),
    categoriaId: vine.number().exists(async (db, value) => {
      const categoria = await db.from('public.categoria').where('id', value).first()
      return categoria != undefined
    }),
    unidadeId: vine.number().exists(async (db, value) => {
      const unidade = await db.from('public.unidade').where('id', value).first()
      return unidade != undefined
    }),
    anexo: vine.string().nullable().optional(),
  })
)

export const produtoUpdateValidator = vine.compile(
  vine.object({
    nome: vine.string().minLength(3).maxLength(255),
    qtdMin: vine.number(),
    quantidade: vine.number(),
    rendimento: vine.number(),
    valor: vine.number(),
    valorReajuste: vine.number().optional(),
    dataReajuste: vine
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    unidadeMedida: vine.number(),
    categoriaId: vine.number().exists(async (db, value) => {
      const categoria = await db.from('public.categoria').where('id', value).first()
      return categoria != undefined
    }),
    unidadeId: vine.number().exists(async (db, value) => {
      const unidade = await db.from('public.unidade').where('id', value).first()
      return unidade != undefined
    }),
    anexo: vine.string().nullable().optional(),
  })
)

export const categoriaCreateValidator = vine.compile(
  vine.object({
    nome: vine.string().minLength(3).maxLength(255),
    unidadeId: vine.number().exists(async (db, value) => {
      const unidade = await db.from('public.unidade').where('id', value).first()
      return unidade != undefined
    }),
  })
)

export const categoriaUpdateValidator = vine.compile(
  vine.object({
    nome: vine.string().minLength(3).maxLength(255).optional(),
    unidadeId: vine.number().exists(async (db, value) => {
      const unidade = await db.from('public.unidade').where('id', value).first()
      return unidade != undefined
    }),
  })
)
