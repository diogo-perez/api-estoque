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

  public async excluirMovimentacao({ params }: HttpContext) {
    const id = params.id

    try {
      const movimentacao = await Movimentacao.findOrFail(id)
      const produto = await Produto.findOrFail(movimentacao.produtoId)

      const fator = [1, 3].includes(produto.unidadeMedida) ? 1000 : 1

      const todasMovs = await Movimentacao.query()
        .where('produto_id', produto.id)
        .orderBy('data', 'asc')

      let saldo = 0

      for (const mov of todasMovs) {
        if (mov.id === movimentacao.id) continue // ignorar a movimentação que será excluída

        const quantidade = mov.quantidade * fator

        if (mov.movTipo === 1) {
          saldo += quantidade
        } else {
          saldo -= quantidade
        }

        if (saldo < 0) {
          throw new Error(
            `A movimentação ${mov.id} (${mov.movTipo === 1 ? 'entrada' : 'saída'} de ${mov.quantidade}) causaria saldo negativo após excluir a movimentação ${movimentacao.id}. Saldo atual simulado: ${saldo / fator}`
          )
        }
      }

      await movimentacao.delete()

      await this.produtoService.atualizarProduto(produto.id, {
        quantidade: saldo / fator,
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
