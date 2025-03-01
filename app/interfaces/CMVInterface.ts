import { CMVItemInterface } from './CMVItemInterface.js'

export interface CMVInterface {
  id?: number
  nome?: string
  faturamento?: number
  valorCMV?: number
  unidadeId?: number
  isAtivo?: boolean
  cmv_item?: CMVItemInterface[]
}
