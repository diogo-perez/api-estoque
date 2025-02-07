import vine from '@vinejs/vine'

export const movimentacaoValidator = vine.compile(
  vine.object({
    data: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    movTipo: vine.number().in([1, 2, 3]),
    quantidade: vine.number(),
    produtoId: vine.number().exists(async (db, value) => {
      const produto = await db.from('public.produto').where('id', value).first()
      return produto != undefined
    }),
    observacao: vine.string().optional(),
  })
)
