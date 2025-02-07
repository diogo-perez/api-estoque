import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const UsuarioController = () => import('#controllers/UsuarioController')
const UnidadeController = () => import('#controllers/UnidadeController')
const CategoriaController = () => import('#controllers/CategoriaController')
const ProdutoController = () => import('#controllers/ProdutoController')
const MovimentacaoController = () => import('#controllers/MovimentacaoController')

router
  .group(() => {
    // Rota para login
    router.post('login', [UsuarioController, 'login'])

    // Rotas para Usuário
    router
      .group(() => {
        router.get('/', [UsuarioController, 'listar'])
        router.post('/', [UsuarioController, 'criar'])
        router.get('/:id', [UsuarioController, 'mostrar']).where('id', router.matchers.number())
        router.put('/:id', [UsuarioController, 'atualizar']).where('id', router.matchers.number())
        router.delete('/:id', [UsuarioController, 'deletar']).where('id', router.matchers.number())
      })
      .prefix('usuario')
    //.use(middleware.auth())

    // Rotas para Unidade
    router
      .group(() => {
        router.get('/', [UnidadeController, 'listar'])
        router.post('/', [UnidadeController, 'criar'])
        router.put('/:id', [UnidadeController, 'atualizar']).where('id', router.matchers.number())
        router.delete('/:id', [UnidadeController, 'deletar']).where('id', router.matchers.number())
      })
      .prefix('unidade')
    //.use(middleware.auth())

    // Rotas para Categoria
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
    //.use(middleware.auth())

    // Rotas para Produto
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

    // Rotas para Entrada
    router
      .group(() => {
        router.get('/', [MovimentacaoController, 'listarMovimentacao'])
        router.post('/', [MovimentacaoController, 'criarMovimentacao'])
        router
          .get('/:id', [MovimentacaoController, 'mostrarMovimentacao'])
          .where('id', router.matchers.number())
      })
      .prefix('movimentacao')
      .use(middleware.auth())
  })
  .prefix('api/v1')
