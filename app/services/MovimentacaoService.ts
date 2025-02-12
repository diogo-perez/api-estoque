import Movimentacao from '#models/movimentacao'
import { MovimentacaoInterface } from 'app/interfaces/MovimentacaoInterface.js'
import ProdutoService from './ProdutoService.js'
import Produto from '#models/produto'
import Categoria from '#models/categoria'

export default class MovimentacaoService {
  private produtoService = new ProdutoService()
  public async listarMovimentacao(
    unidade?: number,
    tipo?: number,
    produto?: number,
    usuario?: number
  ) {
    try {
      let query = Movimentacao.query()

      if (unidade) {
        query = query.where('unidade_id', unidade)
      }

      if (tipo) {
        query = query.where('mov_tipo', tipo)
      }

      if (produto) {
        query = query.where('produto_id', produto)
      }

      if (usuario) {
        query = query.where('usuario_id', usuario)
      }

      const movimentacoes = await query

      const dados = await Promise.all(
        movimentacoes.map(async (mov) => {
          const produto = await Produto.find(mov.produtoId)
          const categoria = produto ? await Categoria.find(produto.categoriaId) : null
          return {
            id: mov.id,
            tipo: mov.movTipo,
            produtoNome: produto?.nome || 'Produto não encontrado',
            quantidade: mov.quantidade,
            categoria_id: produto?.categoriaId,
            categoriaNome: categoria?.nome || 'Categoria não encontrada',
            precoPorcao: produto?.valorPorcao,
            observacao: mov.observacao,
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

  public async criarMovimentacao(dados: MovimentacaoInterface, produto: any, usuarioId?: number) {
    try {
      const qtdMin = produto?.data.qtdMin

      let qtdTotal = produto.data.quantidade
      if (dados.movTipo == 1) {
        if ([1, 3].includes(produto.data.unidadeMedida)) {
          qtdTotal += dados.quantidade * 1000
        } else {
          qtdTotal += dados.quantidade
        }
      } else {
        if ([1, 3].includes(produto.data.unidadeMedida)) {
          qtdTotal -= dados.quantidade * 1000
        } else {
          qtdTotal -= dados.quantidade
        }
        // if (qtdTotal < qtdMin) { //15 < 5
        //   throw new Error('Saida excede a quantidade minima do produto em estoque!')
        // }
      }
      await this.produtoService.atualizarProduto(dados.produtoId, {
        quantidade: qtdTotal,
      })
      dados.usuarioId = usuarioId
      dados.unidadeId = produto.data.unidadeId
      const info = await Movimentacao.create(dados)
      return {
        status: true,
        message: 'Registro cadastrado com sucesso',
        data: info.toJSON(),
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  public async mostrarMovimentacao(id: number) {
    try {
      const info = Movimentacao.findOrFail(id)
      return {
        status: true,
        message: `Registro encontrado`,
        data: (await info).toJSON(),
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }
}
