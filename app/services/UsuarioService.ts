import NotFoundException from '#exceptions/notfound_exception'
import Usuario from '#models/usuario'
import hash from '@adonisjs/core/services/hash'
import { UsuarioInterface } from '../interfaces/UsuarioInterface.js'
import UnauthorizedException from '#exceptions/unauthorized_exception'

export default class UsuarioService {
  public async autenticar(cpf: string, senha: string) {
    try {
      const user = await Usuario.findByOrFail('cpf', cpf)

      if (!user) {
        throw new NotFoundException('Usuário não encontrado', {
          code: 'E_ROW_NOT_FOUND',
          status: 404,
        })
      }
      const isValidPassword = await hash.verify(user.senha, senha)

      if (!isValidPassword)
        throw new UnauthorizedException('Senha inválida', { code: 'UNAUTHORIZED', status: 401 })

      const token = await Usuario.accessTokens.create(user)

      return {
        status: true,
        message: `Usuário autenticado com sucesso`,
        data: {
          id: user.id,
          nome: user.nome,
          tipo: user.tipo,
          unidadeId: user.unidadeId,
          token: token.value!.release(),
        },
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  public async listarUsuarios(unidade?: number) {
    try {
      let query = Usuario.query()

      if (unidade) {
        query = query.whereRaw('?? @> ?', ['unidade_id', [unidade]])
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

  public async criarUsuario(dados: UsuarioInterface) {
    try {
      const info = await Usuario.create(dados)
      return {
        status: true,
        message: 'Registro cadastrado com sucesso',
        data: info.toJSON(),
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  public async mostrarUsuario(id: number) {
    try {
      const info = Usuario.findOrFail(id)
      return {
        status: true,
        message: `Registro encontrado`,
        data: (await info).toJSON(),
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  public async atualizarUsuario(id: number, dados: UsuarioInterface) {
    try {
      const usuario = await Usuario.findOrFail(id)
      usuario.merge(dados)
      await usuario.save()
      return {
        status: true,
        message: 'Registro atualizado com sucesso',
        data: usuario.toJSON(),
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  public async deletarUsuario(id: number) {
    try {
      const usuario = await Usuario.findOrFail(id)
      await usuario.delete()
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
