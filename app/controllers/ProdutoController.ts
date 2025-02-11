import ProdutoService from '#services/ProdutoService'
import { produtoCreateValidator, produtoUpdateValidator } from '#validators/ProdutoValidator'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProdutoController {
  private produtoService = new ProdutoService()

  public async listar({ request, response }: HttpContext) {
    const { unidade, categoria } = request.qs()
    const result = await this.produtoService.listarProdutos(unidade, categoria)
    return response.status(200).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }

  public async criar({ request, response }: HttpContext) {
    const dados = await produtoCreateValidator.validate(request.all())
    const result = await this.produtoService.criarProduto(dados)
    return response.status(201).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }

  public async mostrar({ params, response }: HttpContext) {
    const result = await this.produtoService.mostrarProduto(params.id)
    return response.status(200).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }

  public async atualizar({ params, request, response }: HttpContext) {
    const payload = await produtoUpdateValidator.validate(request.all(), {
      meta: { produtoId: params.id },
    })
    const result = await this.produtoService.atualizarProduto(params.id, payload)
    return response.status(201).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }

  public async deletar({ params, response }: HttpContext) {
    const result = await this.produtoService.deletarProduto(params.id)
    return response.status(200).send({
      status: true,
      message: result.message,
      data: result?.data,
    })
  }
}
