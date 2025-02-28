import Ficha from '#models/ficha'
import FichaItem from '#models/ficha_item'
import { FichaInterface } from 'app/interfaces/FichaInterface.js'
import { FichaItemInterface } from 'app/interfaces/FichaItemInterface.js'

export default class FichaService {
  public async listar(unidade: number) {
    try {
      let query = Ficha.query()

      if (unidade) {
        query = query.where('unidade_id', unidade)
      }

      const fichas = await query.exec()

      const fichaItens = await FichaItem.query().whereIn(
        'ficha_id',
        fichas.map((ficha) => ficha.id)
      )

      const fichaItensMap = fichaItens.reduce(
        (acc, item) => {
          if (!acc[item.pratoId]) {
            acc[item.pratoId] = []
          }
          acc[item.pratoId].push(item)
          return acc
        },
        {} as Record<number, FichaItem[]>
      )

      return {
        status: true,
        message: `${fichas.length} registro(s) encontrado(s)`,
        data: fichas.map((ficha) => ({
          ...ficha.serialize(),
          itens: fichaItensMap[ficha.id] || [],
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
}
