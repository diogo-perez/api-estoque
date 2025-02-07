import Categoria from '#models/categoria'
import { CategoriaInterface } from 'app/interfaces/CategoriaInterface.js'

export default class CategoriaService {
  public async listarCategorias(unidade?: number) {
    try {
      let query = Categoria.query()

      if (unidade) {
        query = query.where('unidade_id', unidade)
      }

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

  public async criarCategoria(dados: CategoriaInterface) {
    try {
      const info = await Categoria.create(dados)
      return {
        status: true,
        message: 'Registro cadastrado com sucesso',
        data: info.toJSON(),
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  public async atualizarCategoria(id: number, dados: CategoriaInterface) {
    try {
      const categoria = await Categoria.findOrFail(id)
      categoria.merge(dados)
      await categoria.save()
      return {
        status: true,
        message: 'Registro atualizado com sucesso',
        data: categoria.toJSON(),
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  public async deletarCategoria(id: number) {
    try {
      const categoria = await Categoria.findOrFail(id)
      await categoria.delete()
      return {
        status: true,
        message: `Registro excluído com sucesso`,
        data: null,
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }
}
