import Usuario from '#models/usuario'
import hash from '@adonisjs/core/services/hash'
import UnauthorizedException from '#exceptions/unauthorized_exception'
import UnidadeService from './UnidadeService.js'
import { UsuarioInterface } from 'app/interfaces/UsuarioInterface.js'

export default class UsuarioService {
  private unidadeService: UnidadeService

  constructor() {
    this.unidadeService = new UnidadeService()
  }

  public async autenticar(cpf: string, senha: string) {
    try {
      const user = await Usuario.findBy('cpf', cpf)

      if (!user) {
        throw new Error('Usuário não encontrado')
      }

      if (!user.isAtivo) {
        throw new Error('Usuário inativo. Contate o administrador.')
      }

      const isValidPassword = await hash.verify(user.senha, senha)

      if (!isValidPassword)
        throw new UnauthorizedException('Senha inválida', { code: 'UNAUTHORIZED', status: 401 })

      const token = await Usuario.accessTokens.create(user)

      const result = await this.unidadeService.listarUnidades()

      if (!result.status) {
        throw new Error('Erro ao buscar informações das unidades')
      }

      const unidadesUsuario = result.data
        .filter(
          (unidade: any) =>
            user.unidadeId?.includes(Number(unidade.id)) ||
            user.unidadeId == null ||
            (user.unidadeId?.length === 0 && unidade.tipo === 1)
        )
        .map((unidade: any) => ({
          id: unidade.id,
          nome: unidade.nome,
        }))

      return {
        status: true,
        message: `Usuário autenticado com sucesso`,
        data: {
          id: user.id,
          nome: user.nome,
          tipo: user.tipo,
          unidade: unidadesUsuario,
          token: token.value!.release(),
        },
      }
    } catch (error) {
      return {
        status: false,
        message: error.message,
      }
    }
  }

  public async listarUsuarios(unidade?: number) {
    try {
      let query = Usuario.query()

      if (unidade) {
        query = query.whereRaw('?? @> ?', ['unidade_id', [unidade]]).where('is_ativo', true)
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
      usuario.isAtivo = !usuario.isAtivo
      usuario.save()
      return {
        status: true,
        message: `Registro alterado com sucesso`,
        data: null,
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }
}
