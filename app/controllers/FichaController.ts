import FichaService from '#services/FichaService'
import type { HttpContext } from '@adonisjs/core/http'
import { FichaInterface } from 'app/interfaces/FichaInterface.js'
import { FichaItemInterface } from 'app/interfaces/FichaItemInterface.js'

export default class FichaController {
  private fichaService = new FichaService()

  public async buscaFicha({ request, response }: HttpContext) {
    const { unidade } = request.qs()

    const result = await this.fichaService.listar(unidade)
    return response.status(200).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }

  public async criar({ request, response }: HttpContext) {
    const { unidade } = request.qs()

    if (!unidade) {
      return response.status(400).send({
        status: false,
        message: 'O parâmetro unidade é obrigatório.',
        data: null,
      })
    }

    // Captura os dados do corpo da requisição e força o tipo correto
    const dados = request.all() as { prato: FichaInterface; produtos: FichaItemInterface[] }

    // Verifica se os dados seguem o formato esperado
    if (!dados.prato || !dados.produtos) {
      return response.status(400).send({
        status: false,
        message:
          'Formato do corpo da requisição inválido. Esperado { prato: {...}, produtos: [...] }',
        data: null,
      })
    }

    // Adiciona unidadeId ao prato antes de passar para o service
    dados.prato.unidadeId = Number(unidade)

    const result = await this.fichaService.criarFicha(dados)

    return response.status(200).send({
      status: result.status,
      message: result.message,
      data: result.data,
    })
  }
}
