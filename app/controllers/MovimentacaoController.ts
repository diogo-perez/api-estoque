import Movimentacao from '#models/movimentacao'
import Produto from '#models/produto'
import MovimentacaoService from '#services/MovimentacaoService'
import ProdutoService from '#services/ProdutoService'
import { movimentacaoValidator } from '#validators/MovimentacaoValidator'
import type { HttpContext } from '@adonisjs/core/http'

export default class MovimentacaoController {
  private movimentacaoService = new MovimentacaoService()
  private produtoService = new ProdutoService()

  public async listarMovimentacao({ request, response }: HttpContext) {
    const { unidade, tipo, produto, usuario } = request.qs()
    const result = await this.movimentacaoService.listarMovimentacao(
      unidade,
      tipo,
      produto,
      usuario
    )
    return response.status(200).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }

  public async criarMovimentacao({ request, response, auth }: HttpContext) {
    const dados = await movimentacaoValidator.validate(request.all())
    const usuarioId = await auth.user
    const produto = await this.produtoService.mostrarProduto(dados.produtoId)

    const result = await this.movimentacaoService.criarMovimentacao(dados, produto, usuarioId?.id)

    return response.status(201).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }

  public async mostrarMovimentacao({ params, response }: HttpContext) {
    const result = await this.movimentacaoService.mostrarMovimentacao(params.id)
    return response.status(200).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }

  public async excluirMovimentacao(id: number) {
    try {
      const movimentacao = await Movimentacao.findOrFail(id)
      const produto = await Produto.findOrFail(movimentacao.produtoId)

      // 1. Buscar todas as movimentações do mesmo produto após a movimentação atual
      const posteriores = await Movimentacao.query()
        .where('produto_id', movimentacao.produtoId)
        .andWhere('data', '>', String(movimentacao.data))
        .orderBy('data', 'asc')

      // 2. Calcular o saldo resultante se essa movimentação for removida
      let saldo = produto.quantidade

      // Reverte o efeito da movimentação a ser excluída
      if ([1, 3].includes(produto.unidadeMedida)) {
        if (movimentacao.movTipo === 1) saldo -= movimentacao.quantidade * 1000
        else saldo += movimentacao.quantidade * 1000
      } else {
        if (movimentacao.movTipo === 1) saldo -= movimentacao.quantidade
        else saldo += movimentacao.quantidade
      }

      // 3. Simula as movimentações posteriores para verificar se o saldo é suficiente
      for (const mov of posteriores) {
        if ([1, 3].includes(produto.unidadeMedida)) {
          if (mov.movTipo === 1) saldo += mov.quantidade * 1000
          else saldo -= mov.quantidade * 1000
        } else {
          if (mov.movTipo === 1) saldo += mov.quantidade
          else saldo -= mov.quantidade
        }

        if (saldo < 0) {
          throw new Error(
            'Não é possível excluir essa movimentação porque existem saídas posteriores que dependem dela. A exclusão resultaria em estoque negativo.'
          )
        }
      }

      // 4. Aplica a exclusão e atualiza o estoque
      await movimentacao.delete()

      await this.produtoService.atualizarProduto(produto.id, {
        quantidade: saldo,
      })

      return {
        status: true,
        message: 'Movimentação excluída com sucesso',
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }
}
