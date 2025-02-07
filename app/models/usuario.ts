import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

export default class Usuario extends BaseModel {
  static table = 'usuario'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare cpf: string

  @column({ serializeAs: null })
  declare senha: string

  @column()
  declare tipo: number

  @column()
  declare unidadeId: number[] | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async hashPassword(usuario: Usuario) {
    if (usuario.$dirty.senha) {
      usuario.senha = await hash.make(usuario.senha)
    }
  }

  static accessTokens = DbAccessTokensProvider.forModel(Usuario, {
    expiresIn: '50 mins',
  })
}
