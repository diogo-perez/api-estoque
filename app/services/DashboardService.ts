import Produto from '#models/produto'

export default class DashboardService {
  public async listar(unidade: number) {
    try {
      let query = Produto.query()

      if (unidade) {
        query = query.where('unidade_id', unidade)
      }

      // Contagem total de produtos
      const totalProdutosQuery = await query.clone().count('* as total')

      // Soma total de itens no estoque
      const totalItensQuery = await query.clone().sum('quantidade as total')

      // Contagem de produtos com quantidade menor ou igual a qtd_min
      const produtosQtdMinQuery = await Produto.query()
        .whereRaw('quantidade <= qtd_min')
        .where('unidade_id', unidade)
        .count('* as total')

      // Buscar os produtos para calcular o valor total
      const produtos = await query.select('quantidade', 'valor')

      // Calcular o valor total (quantidade * valor)
      const valorTotalItens = produtos.reduce((acc, produto) => {
        return acc + produto.quantidade * produto.valor
      }, 0)

      const qtdtotal = totalProdutosQuery[0].$extras.total
      const qtdItens = totalItensQuery[0].$extras.total
      const produtosQtdMin = produtosQtdMinQuery[0].$extras.total || 0

      return {
        status: true,
        data: {
          totalProduto: Number(qtdtotal),
          totalItens: qtdItens,
          valorTotalItens: Number(valorTotalItens).toFixed(2),
          produtosQtdMin: Number(produtosQtdMin),
        },
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }
}
