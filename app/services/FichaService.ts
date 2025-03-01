import Ficha from '#models/ficha'
import FichaItem from '#models/ficha_item'
import Produto from '#models/produto'
import { FichaInterface } from 'app/interfaces/FichaInterface.js'
import { FichaItemInterface } from 'app/interfaces/FichaItemInterface.js'

export default class FichaService {
  public async listar(unidade: number) {
    try {
      let query = Ficha.query()

      if (unidade) {
        query = query.where('unidade_id', unidade).where('is_ativo', true)
      }

      const fichas = await query.exec()

      // Busca os itens e carrega os produtos relacionados
      const fichaItens = await FichaItem.query().whereIn(
        'prato_id',
        fichas.map((ficha) => ficha.id)
      )

      const produtos = await Produto.query().whereIn(
        'id',
        fichaItens.map((item) => item.produtoId)
      )
      const produtosMap = produtos.reduce(
        (acc, produto) => {
          acc[produto.id] = produto.nome
          return acc
        },
        {} as Record<number, string>
      )

      // Agrupar os itens da ficha pelo pratoId
      const fichaItensMap = fichaItens.reduce(
        (acc, item) => {
          if (!acc[item.pratoId]) {
            acc[item.pratoId] = []
          }
          acc[item.pratoId].push({
            id: item.id,
            qtdUtilizado: item.qtdUtilizado,
            valorUtilizado: item.valorUtilizado,
            produtoId: item.produtoId,
            pratoId: item.pratoId,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            produtoNome: produtosMap[item.produtoId] || 'Produto não encontrada',
          })
          return acc
        },
        {} as Record<number, any[]>
      )

      return {
        status: true,
        message: `${fichas.length} registro(s) encontrado(s)`,
        data: fichas.map((ficha) => ({
          ...ficha.serialize(),
          produtos: fichaItensMap[ficha.id] || [],
        })),
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  public async criarFicha(dados: { prato: FichaInterface; produtos: FichaItemInterface[] }) {
    if (!dados.prato.unidadeId) {
      return {
        status: false,
        message: 'O parâmetro unidade é obrigatório.',
        data: null,
      }
    }

    try {
      // Criamos a ficha na tabela prato
      const ficha = await Ficha.create(dados.prato)

      // Verifica se os produtos existem antes de continuar
      if (dados.produtos && dados.produtos.length > 0) {
        const fichaItens = dados.produtos.map((produto) => ({
          qtdUtilizado: produto.qtdUtilizado,
          valorUtilizado: produto.valorUtilizado,
          produtoId: Number(produto.produtoId),
          pratoId: ficha.id, // Associa o id da ficha com o pratoId do item
        }))

        // Salva os itens na tabela prato_itens
        await FichaItem.createMany(fichaItens)
      }

      return {
        status: true,
        message: 'Registro cadastrado com sucesso',
        data: ficha.toJSON(), // Retorna a ficha principal criada
      }
    } catch (error) {
      console.error('Erro ao criar ficha:', error) // Log do erro para depuração
      return {
        status: false,
        message: 'Erro interno do servidor',
        errors: error.message,
      }
    }
  }

  public async deletarFicha(id: number) {
    try {
      const ficha = await Ficha.findOrFail(id)
      ficha.isAtivo = false
      ficha.save()

      return {
        status: true,
        message: `Ficha inativada com sucesso!`,
        data: null,
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }
}
