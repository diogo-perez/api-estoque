import Produto from '#models/produto'
import { Database } from '@adonisjs/lucid/database'

export default class DashboardService {
  public async listar(unidade?: number) {
    try {
      let query = Produto.query()

      if (unidade) {
        query = query.where('unidade_id', unidade)
      }
      const totalProdutos = await query.count('* as total')
      const totalItens = await query.sum('quantidade as total')

      const qtdtotal = totalProdutos[0].$extras.total
      const qtdItens = totalItens[0].$extras.total

      return {
        status: true,
        data: {
          totalProduto: qtdtotal,
          totalItens: qtdItens,
        },
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }
}
