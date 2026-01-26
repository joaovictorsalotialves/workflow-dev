import chai from 'chai'
import chaiHttp from 'chai-http'
import { after } from 'mocha'
import app from '../../app.js'
import db from '../../db/dbconfig.js'

chai.use(chaiHttp)
const { expect } = chai

let requester
before(() => {
  requester = chai.request.agent(app)
})

after(async () => {
  requester.close()
  await db.destroy()
})

describe('GET em /livros', () => {
  it('Deve retornar uma lista de livros', done => {
    requester
      .get('/livros')
      .set('Accept', 'application/json')
      .end((_err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body[0]).to.have.property('id')
        expect(res.body[0]).to.have.property('titulo')
        expect(res.body[0]).to.have.property('paginas')
        expect(res.body[0]).to.have.property('editora_id')
        expect(res.body[0]).to.have.property('autor_id')
        done()
      })
  })

  it('Deve retornar um livro', done => {
    const idLivro = 1
    requester
      .get(`/livros/${idLivro}`)
      .set('Accept', 'application/json')
      .end((_err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body).to.have.property('id')
        expect(res.body).to.have.property('titulo')
        expect(res.body).to.have.property('paginas')
        expect(res.body).to.have.property('editora_id')
        expect(res.body).to.have.property('autor_id')
        done()
      })
  })

  it('Não deve retornar um livro com id inválido', done => {
    const idLivro = 'A'
    requester
      .get(`/livros/${idLivro}`)
      .set('Accept', 'application/json')
      .end((_err, res) => {
        expect(res.status).to.equal(404)
        expect(res.body).to.have.property('message').eql(`id ${idLivro} não encontrado`)
        done()
      })
  })
})

describe('POST em /livros', () => {
  it('Deve criar um novo livro', done => {
    const livro = {
      titulo: 'Livro Teste',
      paginas: 234,
      editora_id: 2,
      autor_id: 2,
    }
    requester
      .post('/livros')
      .set('Accept', 'application/json')
      .send(livro)
      .end((_err, res) => {
        expect(res.status).to.equal(201)
        expect(res.body).to.have.property('message').eql('livro criado')
        done()
      })
  })

  it('Não deve criar um livro ao receber body vazio', done => {
    const editora = {}
    requester
      .post('/livros')
      .set('Accept', 'application/json')
      .send(editora)
      .end((_err, res) => {
        expect(res.status).to.equal(400)
        expect(res.body).to.have.property('message').eql('corpo da requisição vazio')
        done()
      })
  })
})

describe('PUT em /livros', () => {
  it('Deve atualizar um livro', done => {
    const idLivro = 2
    const livroAtualizado = {
      titulo: 'Árvore e Folha',
      paginas: 333,
    }
    requester
      .put(`/livros/${idLivro}`)
      .set('Accept', 'application/json')
      .send(livroAtualizado)
      .end((_err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body.content[0]).to.include({
          titulo: livroAtualizado.titulo,
          paginas: livroAtualizado.paginas,
        })
        done()
      })
  })

  it('Não deve atualizar um livro com id inválido', done => {
    const idLivro = 'A'
    const livroAtualizado = {
      titulo: 'Os Filhos de Húrin',
    }
    requester
      .put(`/livros/${idLivro}`)
      .set('Accept', 'application/json')
      .send(livroAtualizado)
      .end((_err, res) => {
        expect(res.status).to.equal(404)
        expect(res.body).to.have.property('message').eql(`id ${idLivro} não encontrado`)
        done()
      })
  })
})

describe('DELETE em /livros', () => {
  it('Deve deletar um livro', done => {
    const idLivro = 1
    requester
      .delete(`/livros/${idLivro}`)
      .set('Accept', 'application/json')
      .end((_err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body).to.have.property('message').eql('livro excluído')
        done()
      })
  })

  it('Não deve deletar um livro com id inválido', done => {
    const idLivro = 'A'
    requester
      .delete(`/livros/${idLivro}`)
      .set('Accept', 'application/json')
      .end((_err, res) => {
        expect(res.status).to.equal(404)
        expect(res.body).to.have.property('message').eql(`Livro com id ${idLivro} não encontrado`)
        done()
      })
  })
})
