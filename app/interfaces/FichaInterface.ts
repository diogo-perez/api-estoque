import { FichaItemInterface } from './FichaItemInterface.js'

export interface FichaInterface {
  id?: number
  nome?: string
  custoTotal?: number
  qtdRendimento?: number
  valorRendimento?: number
  valorVenda?: number
  cmvReal?: number
  lucroReal?: number
  unidadeId?: number
  produtos?: FichaItemInterface[]
}
