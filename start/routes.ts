import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import DashboardController from '#controllers/DashboardController'
import RelatorioController from '#controllers/RelatorioController'
import FichaController from '#controllers/FichaController'
import CMVController from '#controllers/CMVController'
const UsuarioController = () => import('#controllers/UsuarioController')
const UnidadeController = () => import('#controllers/UnidadeController')
const CategoriaController = () => import('#controllers/CategoriaController')
const ProdutoController = () => import('#controllers/ProdutoController')
const MovimentacaoController = () => import('#controllers/MovimentacaoController')

router
  .group(() => {
    router.post('login', [UsuarioController, 'login'])

    router
      .group(() => {
        router.get('/', [UsuarioController, 'listar'])
        router.post('/', [UsuarioController, 'criar'])
        router.get('/:id', [UsuarioController, 'mostrar']).where('id', router.matchers.number())
        router.put('/:id', [UsuarioController, 'atualizar']).where('id', router.matchers.number())
        router.delete('/:id', [UsuarioController, 'deletar']).where('id', router.matchers.number())
      })
      .prefix('usuario')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [UnidadeController, 'listar'])
        router.post('/', [UnidadeController, 'criar'])
        router.put('/:id', [UnidadeController, 'atualizar']).where('id', router.matchers.number())
        router.delete('/:id', [UnidadeController, 'deletar']).where('id', router.matchers.number())
      })
      .prefix('unidade')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [CategoriaController, 'listar'])
        router.post('/', [CategoriaController, 'criar'])
        router.put('/:id', [CategoriaController, 'atualizar']).where('id', router.matchers.number())
        router
          .delete('/:id', [CategoriaController, 'deletar'])
          .where('id', router.matchers.number())
      })
      .prefix('categoria')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [ProdutoController, 'listar'])
        router.post('/', [ProdutoController, 'criar'])
        router.get('/:id', [ProdutoController, 'mostrar']).where('id', router.matchers.number())
        router.put('/:id', [ProdutoController, 'atualizar']).where('id', router.matchers.number())
        router.delete('/:id', [ProdutoController, 'deletar']).where('id', router.matchers.number())
      })
      .prefix('produto')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [MovimentacaoController, 'listarMovimentacao'])
        router.post('/', [MovimentacaoController, 'criarMovimentacao'])
        router
          .get('/:id', [MovimentacaoController, 'mostrarMovimentacao'])
          .where('id', router.matchers.number())
        router.delete('/:id', [MovimentacaoController, 'excluirMovimentacao'])
      })
      .prefix('movimentacao')
      .use(middleware.auth())

    router
      .group(() => {
        router
          .get('disperdicio/:id', [RelatorioController, 'listarDisperdicio'])
          .where('id', router.matchers.number())
      })
      .prefix('relatorio')
      .use(middleware.auth())

    router
      .group(() => {
        router.post('/', [DashboardController, 'mostrarDashboard'])
      })
      .prefix('dashboard')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [FichaController, 'buscaFicha'])
        router.post('/', [FichaController, 'criar'])
        router.put('/:id', [FichaController, 'atualizar']).where('id', router.matchers.number())
        router.delete('/:id', [FichaController, 'deletar']).where('id', router.matchers.number())
      })
      .prefix('ficha')
      .use(middleware.auth())
    router
      .group(() => {
        router.get('/', [CMVController, 'buscaCMV'])
        router.post('/', [CMVController, 'criaCMV'])
        router.get('/:id', [CMVController, 'mostrar']).where('id', router.matchers.number())
        router.put('/:id', [CMVController, 'atualizar']).where('id', router.matchers.number())
        router.delete('/:id', [CMVController, 'deletar']).where('id', router.matchers.number())
      })
      .prefix('cmv')
      .use(middleware.auth())
  })
  .prefix('api/v1')
