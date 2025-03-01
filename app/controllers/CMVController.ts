import CMVService from '#services/CMVService'
import { UpdateCMVValidator } from '#validators/CmvValidator'
import type { HttpContext } from '@adonisjs/core/http'
import { CMVInterface } from 'app/interfaces/CMVInterface.js'
import { CMVItemInterface } from 'app/interfaces/CMVItemInterface.js'

export default class CMVController {
  async buscaCMV({ request, response }: HttpContext) {
    const unidadeId = request.qs().unidade_id
    const result = await CMVService.listarPorUnidade(unidadeId)
    return response
      .status(200)
      .send({ status: true, message: 'CMV listados com sucesso', data: result })
  }

  async mostrar({ params, response }: HttpContext) {
    const result = await CMVService.mostrar(params.id)
    return response.status(200).send({ status: true, message: 'CMV encontrado', data: result })
  }

  async criaCMV({ request, response }: HttpContext) {
    const dados = request.all() as { cmv: CMVInterface; produtos: CMVItemInterface[] }
    const result = await CMVService.criar(dados)

    return response
      .status(201)
      .send({ status: true, message: 'CMV criado com sucesso', data: result.data })
  }

  async atualizar({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(UpdateCMVValidator)
    const result = await CMVService.atualizar(params.id, payload)
    return response
      .status(200)
      .send({ status: true, message: 'CMV atualizado com sucesso', data: result })
  }

  async deletar({ params, response }: HttpContext) {
    const result = await CMVService.inativar(params.id)
    return response
      .status(200)
      .send({ status: true, message: 'CMV inativado com sucesso', data: result })
  }
}
