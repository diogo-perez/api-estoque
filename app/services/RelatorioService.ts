import Movimentacao from '#models/movimentacao'
import Produto from '#models/produto'

export default class RelatorioService {
  public async listarDisperdicio(unidade?: number) {
    try {
      let query = Movimentacao.query().where('mov_tipo', 3)
      // Buscar movimentações com movTipo = 3 e unidade_id correspondente

      if (unidade !== undefined) {
        query = query.andWhere('unidade_id', unidade).andWhere('is_ativo', true)
      }

      const movimentacoes = await query

      if (movimentacoes.length === 0) {
        return {
          status: true,
          message: 'Nenhum registro encontrado',
          data: [],
        }
      }

      // Buscar os produtos correspondentes e calcular o desperdício total
      const dados = await Promise.all(
        movimentacoes.map(async (mov) => {
          const produto = await Produto.find(mov.produtoId)

          return {
            id: mov.id,
            produtoNome: produto?.nome || 'Produto não encontrado',
            valorUnitario: produto?.valor || 0,
            quantidade: mov.quantidade,
            desperdicioTotal: (produto?.valor || 0) * mov.quantidade,
            data: mov.data,
          }
        })
      )
      return {
        status: true,
        message: `${dados.length} registro(s) encontrado(s)`,
        data: dados,
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }
}
