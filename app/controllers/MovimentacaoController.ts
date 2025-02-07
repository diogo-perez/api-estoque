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
}
