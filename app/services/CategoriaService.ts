import Categoria from '#models/categoria'
import Produto from '#models/produto'
import { CategoriaInterface } from 'app/interfaces/CategoriaInterface.js'

export default class CategoriaService {
  public async listarCategorias(unidade?: number) {
    try {
      let query = Categoria.query()

      if (unidade) {
        query = query.where('unidade_id', unidade).where('is_ativo', true)
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
      const produtosVinculados = await Produto.query().where('categoria_id', id).count('* as total')
      if (produtosVinculados[0].$extras.total > 0) {
        return {
          status: false,
          message: 'Não é possível inativar a categoria, pois há produtos vinculados a ela.',
          data: null,
        }
      }
      categoria.isAtivo = !categoria.isAtivo
      await categoria.save()
      return {
        status: true,
        message: `Categoria ${categoria.isAtivo == false ? 'inativada' : 'ativa'} com sucesso`,
        data: null,
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }
}
