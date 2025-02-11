import RelatorioService from '#services/RelatorioService'
import type { HttpContext } from '@adonisjs/core/http'

export default class RelatorioController {
  private relatorioService = new RelatorioService()

  public async listarDisperdicio({ params, response }: HttpContext) {
    const { unidade } = params.id
    const result = await this.relatorioService.listarDisperdicio(unidade)
    return response.status(200).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }
}
