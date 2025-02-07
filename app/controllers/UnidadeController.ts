import UnidadeService from '#services/UnidadeService'
import { unidadeCreateValidator, unidadeUpdateValidator } from '#validators/UnidadeValidator'
import type { HttpContext } from '@adonisjs/core/http'

export default class UnidadeController {
  private unidadeService = new UnidadeService()

  public async listar({ response }: HttpContext) {
    const result = await this.unidadeService.listarUnidades()
    return response.status(200).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }

  public async criar({ request, response }: HttpContext) {
    const dados = await unidadeCreateValidator.validate(request.all())

    const result = await this.unidadeService.criarUnidade(dados)
    return response.status(201).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }

  public async atualizar({ params, request, response }: HttpContext) {
    const payload = await unidadeUpdateValidator.validate(request.all(), {
      meta: { unidadeId: params.id },
    })
    const result = await this.unidadeService.atualizarUnidade(params.id, payload)
    return response.status(201).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }

  public async deletar({ params, response }: HttpContext) {
    const result = await this.unidadeService.deletarUnidade(params.id)
    return response.status(200).send({
      status: true,
      message: result.message,
      data: result?.data,
    })
  }
}
