import CMVService from '#services/CMVService'
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
    try {
      // Validação do payload
      const payload = await request.all()

      const data = {
        cmv: {
          nome: payload.nome,
          faturamento: payload.faturamento,
          valorCMV: payload.valorCMV,
          isAtivo: payload.isAtivo,
        },
        produtos: payload.produtos ?? [],
      }

      // Chamada ao serviço para atualização
      const result = await CMVService.atualizar(params.id, data)

      if (!result.status) {
        return response.status(400).send(result) // Se a atualização falhar, retorna erro
      }

      return response.status(200).send({
        status: true,
        message: 'CMV atualizado com sucesso',
        data: result.data,
      })
    } catch (error) {
      return response.status(500).send({
        status: false,
        message: 'Erro interno ao atualizar CMV',
        errors: error.message || 'Erro desconhecido',
      })
    }
  }

  async deletar({ params, response }: HttpContext) {
    const result = await CMVService.inativar(params.id)
    return response
      .status(200)
      .send({ status: true, message: 'CMV inativado com sucesso', data: result })
  }
}
