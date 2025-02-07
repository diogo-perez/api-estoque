import Unidade from '#models/unidade'
import { UnidadeInterface } from 'app/interfaces/UnidadeInterface.js'

export default class UnidadeService {
  public async listarUnidades() {
    try {
      let query = Unidade.query().where('is_ativo', true)

      const info = await query.exec()
      return {
        status: true,
        message: `${info.length} registro(s) encontrado(s)`,
        data: info,
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  public async criarUnidade(dados: UnidadeInterface) {
    try {
      const info = await Unidade.create(dados)
      return {
        status: true,
        message: 'Registro cadastrado com sucesso',
        data: info.toJSON(),
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  public async atualizarUnidade(id: number, dados: UnidadeInterface) {
    try {
      const unidade = await Unidade.findOrFail(id)
      unidade.merge(dados)
      await unidade.save()
      return {
        status: true,
        message: 'Registro atualizado com sucesso',
        data: unidade.toJSON(),
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  public async deletarUnidade(id: number) {
    try {
      const unidade = await Unidade.findOrFail(id)
      unidade.isAtivo = false
      unidade.save()
      return {
        status: true,
        message: `Registro inativo com sucesso`,
        data: null,
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }
}
