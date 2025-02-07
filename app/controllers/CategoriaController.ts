import CategoriaService from '#services/CategoriaService'
import { categoriaCreateValidator, categoriaUpdateValidator } from '#validators/ProdutoValidator'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriaController {
  private categoriaService = new CategoriaService()

  public async listar({ request, response }: HttpContext) {
    const { unidade } = request.qs()

    const result = await this.categoriaService.listarCategorias(unidade)
    return response.status(200).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }

  public async criar({ request, response }: HttpContext) {
    const dados = await categoriaCreateValidator.validate(request.all())

    const result = await this.categoriaService.criarCategoria(dados)
    return response.status(201).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }

  public async atualizar({ params, request, response }: HttpContext) {
    const payload = await categoriaUpdateValidator.validate(request.all(), {
      meta: { categoriaId: params.id },
    })
    const result = await this.categoriaService.atualizarCategoria(params.id, payload)
    return response.status(201).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }

  public async deletar({ params, response }: HttpContext) {
    const result = await this.categoriaService.deletarCategoria(params.id)
    return response.status(200).send({
      status: true,
      message: result.message,
      data: result?.data,
    })
  }
}
