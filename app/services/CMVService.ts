import Categoria from '#models/categoria'
import CMV from '#models/cmv'
import CMVItem from '#models/cmv_item'
import Produto from '#models/produto'
import { CMVInterface } from 'app/interfaces/CMVInterface.js'
import { CMVItemInterface } from 'app/interfaces/CMVItemInterface.js'

export default class CMVService {
  static async listarPorUnidade(unidadeId: number) {
    try {
      let query = CMV.query()
      if (unidadeId) {
        query = query.where('unidade_id', unidadeId).where('is_ativo', true)
      }
      const itens = await query.exec()

      // Buscar os itens de CMV associados
      const cmvItens = await CMVItem.query().whereIn(
        'cmv_id',
        itens.map((ficha) => ficha.id)
      )
      console.log(cmvItens)
      // Buscar os produtos associados aos itens
      const produtos = await Produto.query().whereIn(
        'id',
        cmvItens.map((item) => item.produtoId)
      )

      // Buscar as categorias dos produtos
      const categorias = await Categoria.query().whereIn(
        'id',
        produtos.map((produto) => produto.categoriaId)
      )

      // Mapeamento dos produtos por ID
      const produtosMap = produtos.reduce(
        (acc, produto) => {
          acc[produto.id] = {
            nome: produto.nome,
            valor: produto.valor,
            categoriaId: produto.categoriaId,
          }
          return acc
        },
        {} as Record<number, { nome: string; valor: number; categoriaId: number }>
      )

      // Mapeamento das categorias por ID
      const categoriasMap = categorias.reduce(
        (acc, categoria) => {
          acc[categoria.id] = categoria.nome
          return acc
        },
        {} as Record<number, string>
      )

      // Associar os produtos e categorias aos itens do CMV
      const resultado = itens.map((cmv) => {
        const cmvItensAssociados = cmvItens.filter((item) => item.cmvId === cmv.id)

        return {
          id: cmv.id,
          nome: cmv.nome,
          faturamento: cmv.faturamento,
          valorCMV: cmv.valorCMV,
          unidadeId: cmv.unidadeId,
          isAtivo: cmv.isAtivo,
          itens: cmvItensAssociados.map((item) => ({
            id: item.id,
            estoqueInicial: item.estoqueInicial,
            valorInicial: item.valorInicial,
            entrada: item.entrada,
            valorEntrada: item.valorEntrada,
            estoqueFinal: item.estoqueFinal,
            valorEstoqueFinal: item.valorEstoqueFinal,
            utilizado: item.utilizado,
            valorUtilizado: item.valorUtilizado,
            produto: produtosMap[item.produtoId],
            categoria: categoriasMap[produtosMap[item.produtoId].categoriaId],
          })),
        }
      })

      return resultado
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  static async mostrar(id: number) {
    try {
      const cmv = await CMV.findOrFail(id)
      // Buscar os itens de CMV associados
      const cmvItens = await CMVItem.query().where('cmvId', cmv.id)
      // Buscar os produtos associados aos itens
      const produtos = await Produto.query().whereIn(
        'id',
        cmvItens.map((item) => item.produtoId)
      )
      // Buscar as categorias dos produtos
      const categorias = await Categoria.query().whereIn(
        'id',
        produtos.map((produto) => produto.categoriaId)
      )

      // Mapeamento dos produtos por ID
      const produtosMap = produtos.reduce(
        (acc, produto) => {
          acc[produto.id] = {
            nome: produto.nome,
            valor: produto.valor,
            categoriaId: produto.categoriaId,
          }
          return acc
        },
        {} as Record<number, { nome: string; valor: number; categoriaId: number }>
      )

      // Mapeamento das categorias por ID
      const categoriasMap = categorias.reduce(
        (acc, categoria) => {
          acc[categoria.id] = categoria.nome
          return acc
        },
        {} as Record<number, string>
      )

      const itensFormatados = cmvItens.map((item) => ({
        id: item.id,
        estoqueInicial: item.estoqueInicial,
        valorInicial: item.valorInicial,
        entrada: item.entrada,
        valorEntrada: item.valorEntrada,
        estoqueFinal: item.estoqueFinal,
        valorEstoqueFinal: item.valorEstoqueFinal,
        utilizado: item.utilizado,
        valorUtilizado: item.valorUtilizado,
        produto: produtosMap[item.produtoId],
        categoria: categoriasMap[produtosMap[item.produtoId].categoriaId],
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }))

      return {
        id: cmv.id,
        nome: cmv.nome,
        faturamento: cmv.faturamento,
        valorCMV: cmv.valorCMV,
        unidadeId: cmv.unidadeId,
        isAtivo: cmv.isAtivo,
        createdAt: cmv.createdAt,
        updatedAt: cmv.updatedAt,
        itens: itensFormatados,
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  static async criar(data: { cmv: CMVInterface; produtos: CMVItemInterface[] }) {
    try {
      const cmv = await CMV.create(data.cmv)
      console.log(cmv)
      // Adicionar os itens (cmv_item) associados ao CMV
      if (data.produtos && data.produtos.length > 0) {
        const fichaItens = data.produtos.map((produto) => ({
          estoqueInicial: produto.estoqueInicial,
          valorInicial: produto.valorInicial,
          entrada: produto.entrada,
          valorEntrada: produto.valorEntrada,
          estoqueFinal: produto.estoqueFinal,
          valorEstoqueFinal: produto.valorEstoqueFinal,
          utilizado: produto.utilizado,
          valorUtilizado: produto.valorUtilizado,
          produtoId: Number(produto.produtoId),
          cmvId: cmv.id, // Associa o id da ficha com o pratoId do item
        }))
        console.log(fichaItens)
        await CMVItem.createMany(fichaItens)
      }

      return {
        status: true,
        message: 'Registro cadastrado com sucesso',
        data: cmv.toJSON(), // Retorna a ficha principal criada
      }
    } catch (error) {
      return {
        status: false,
        message: error,
        errors: error.message,
      }
    }
  }

  static async atualizar(id: number, data: Partial<CMVInterface>) {
    const cmv = await CMV.findOrFail(id)

    cmv.merge(data)
    await cmv.save()

    // Atualizar os itens (cmv_item) associados, se necessário
    if (data.cmv_item) {
      // Apagar os itens antigos, se houver, e adicionar os novos
      await CMVItem.query().where('cmvId', cmv.id).delete()

      await CMVItem.createMany(
        data.cmv_item.map((item) => ({
          ...item,
          cmvId: cmv.id, // Associar o CMV ao item
        }))
      )
    }

    return cmv
  }

  static async inativar(id: number) {
    const cmv = await CMV.findOrFail(id)
    cmv.isAtivo = false
    await cmv.save()
    return cmv
  }
}
