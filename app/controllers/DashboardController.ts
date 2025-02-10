import DashboardService from '#services/DashboardService'
import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  private dashboardService = new DashboardService()

  public async mostrarDashboard({ request, response }: HttpContext) {
    const { unidade } = request.qs()

    const result = await this.dashboardService.listar(unidade)
    return response.status(200).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }
}
