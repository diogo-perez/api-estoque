export interface UsuarioInterface {
  id?: number
  nome?: string
  cpf?: string
  senha?: string
  tipo?: number
  unidadeId?: number[] | null
  isAtivo?: boolean
}
