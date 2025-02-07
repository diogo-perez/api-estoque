import Produto from '#models/produto'
import { ProdutoInterface } from 'app/interfaces/ProdutoInterface.js'

export default class ProdutoService {
  public async listarProdutos(unidade?: number, categoria?: number) {
    try {
      let query = Produto.query()

      if (unidade) {
        query = query.where('unidade_id', unidade)
      }

      if (categoria) {
        query = query.where('categoria_id', categoria)
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

  public async criarProduto(dados: ProdutoInterface) {
    try {
      let valorFinal = dados.valorReajuste ?? dados.valor ?? 0
      let valorPorcao = dados.rendimento * valorFinal
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
