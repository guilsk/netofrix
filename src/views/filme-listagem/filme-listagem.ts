import "bootstrap";
import { FilmeService } from "../../services/filmes.services";
import { Filme } from "../../models/Filme";

import "./filme-listagem.css";

export class ListagemFilme{
  
  private filmeService: FilmeService

  gridFilmes: HTMLElement
  btnCarregarMaisFilmes: HTMLButtonElement

  constructor(){
    this.filmeService = new FilmeService()
    this.registrarElementos()
    this.filmeService.selecionarFilmes().then(filmes => this.gerarGridFilmes(filmes))
  }

  registrarElementos(){
    this.gridFilmes = document.getElementById('grid-filmes') as HTMLElement
    this.btnCarregarMaisFilmes = document.getElementById('btnCarregarMaisFilmes') as HTMLButtonElement

    this.btnCarregarMaisFilmes.addEventListener('click', () => this.carregarMaisFilmes())
  }

  carregarMaisFilmes(){
    this.filmeService.nPage++
    this.filmeService.page = String(this.filmeService.nPage)
        
    this.filmeService.selecionarFilmes().then(filmes => this.gerarGridFilmes(filmes))
  }

  private gerarGridFilmes(filmes: Filme[]): any{
    for (let filme of filmes) {
      const card = this.gerarFilme(filme)

      this.gridFilmes.appendChild(card) 
    }
  }
  
  private gerarFilme(filme: Filme){
    const bloco = document.createElement('div')
    bloco.classList.add('col-6', 'col-md-4', 'col-lg-2', 'mb-4')

    const dGrid = document.createElement('div')
    dGrid.classList.add('d-grid', 'gap-1', 'text-center')

    const imagem = document.createElement('img')
    imagem.classList.add('img-fluid', 'rounded-3')
    imagem.id = 'poster'
    imagem.src = filme.posterUrl

    const titulo = document.createElement('a')
    titulo.classList.add('fs-6', 'link-warning', 'text-decoration-none')
    titulo.id = 'titulo'
    titulo.innerHTML = filme.name

    dGrid.appendChild(imagem)
    dGrid.appendChild(titulo)

    bloco.appendChild(dGrid)

    bloco.addEventListener('click', () => this.redirecionarUsuario(filme.id))
    return bloco
  }
  
  redirecionarUsuario(id: number){
    window.location.href = 'detalhes.html?id='+id
  }
}

window.addEventListener("load", () => new ListagemFilme())