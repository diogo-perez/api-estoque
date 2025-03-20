import Categoria from '#models/categoria'
import Produto from '#models/produto'
import { ProdutoInterface } from 'app/interfaces/ProdutoInterface.js'

export default class ProdutoService {
  public async listarProdutos(unidade?: number, cat?: number) {
    try {
      let query = Produto.query()

      if (unidade) {
        query = query.where('unidade_id', unidade)
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
      let valorFinal = dados.valorReajuste ?? dados.valor ?? produto.valor ?? 0
      let valorPorcao = valorFinal / (dados.rendimento ?? produto.rendimento)

      produto.merge({ ...dados, valorPorcao })

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
        message: `Registro excluido com sucesso`,
        data: null,
      }
    } catch (error) {
      if (error.message.includes('violates foreign key constraint')) {
        return {
          status: false, // Aqui o status é alterado para false em caso de erro
          message: 'Produto não pode ser inativado pois há registro de movimentação em seu código.',
          errors: error.message,
        }
      }
      return {
        status: false, // Status false para outros tipos de erro também
        message: 'Erro interno do servidor',
        errors: error.message,
      }
    }
  }
}
