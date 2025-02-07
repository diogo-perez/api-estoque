export interface ProdutoInterface {
  id?: number
  nome?: string
  qtdMin: number
  quantidade: number
  rendimento: number
  precoPorcao?: number
  valor?: number
  valorReajuste?: number
  dataReajuste?: string
  unidadeMedida: number
  categoriaId?: number
  unidadeId?: number
  anexo?: string | null
}
