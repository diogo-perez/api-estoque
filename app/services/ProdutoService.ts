import Categoria from '#models/categoria'
import Produto from '#models/produto'
import { ProdutoInterface } from 'app/interfaces/ProdutoInterface.js'

export default class ProdutoService {
  public async listarProdutos(unidade?: number, cat?: number) {
    try {
      let query = Produto.query()

      if (unidade) {
        query = query.where('unidade_id', unidade).where('is_ativo', true)
      }

      if (cat) {
        query = query.where('categoria_id', cat).where('is_ativo', true)
      }

      const info = await query.exec()
      const categorias = await Categoria.query().whereIn(
        'id',
        info.map((produto) => produto.categoriaId)
      )
      const categoriasMap = categorias.reduce(
        (acc, categoria) => {
          acc[categoria.id] = categoria.nome
          return acc
        },
        {} as Record<number, string>
      )
      return {
        status: true,
        message: `${info.length} registro(s) encontrado(s)`,
        data: info.map((produto) => ({
          ...produto.serialize(),
          categoriaNome: categoriasMap[produto.categoriaId] || 'Categoria não encontrada',
        })),
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  public async criarProduto(dados: ProdutoInterface) {
    try {
      let valorFinal = dados.valorReajuste ?? dados.valor ?? 0
      let valorPorcao = valorFinal / dados.rendimento
      const info = await Produto.create({ ...dados, valorPorcao })

      return {
        status: true,
        message: 'Registro cadastrado com sucesso',
        data: info.toJSON(),
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  public async mostrarProduto(id: number) {
    try {
      const info = Produto.findOrFail(id)
      return {
        status: true,
        message: `Registro encontrado`,
        data: (await info).toJSON(),
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  public async atualizarProduto(id: number, dados: any) {
    try {
      const produto = await Produto.findOrFail(id)
      produto.merge(dados)
      await produto.save()
      return {
        status: true,
        message: 'Registro atualizado com sucesso',
        data: produto,
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  public async deletarProduto(id: number) {
    try {
      const produto = await Produto.findOrFail(id)
      await produto.delete()
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
