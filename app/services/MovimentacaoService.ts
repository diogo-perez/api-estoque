import Movimentacao from '#models/movimentacao'
import { MovimentacaoInterface } from 'app/interfaces/MovimentacaoInterface.js'
import ProdutoService from './ProdutoService.js'

export default class MovimentacaoService {
  private produtoService = new ProdutoService()
  public async listarMovimentacao(
    unidade?: number,
    tipo?: number,
    produto?: number,
    usuario?: number
  ) {
    try {
      let query = Movimentacao.query().where('is_ativo', true)

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

      const info = await query.exec()
      return {
        status: true,
        message: `${info.length} registro(s) encontrado(s)`,
        data: info,
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
        if (qtdTotal < qtdMin) {
          throw new Error('Saida excede a quantidade minima do produto em estoque!')
        }
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
