import "bootstrap"
import { FilmeService } from "../../services/filmes.services"
import { Filme } from "../../models/Filme"

import "./filme-detalhes.css"

export class DetalhesFilme {

  tituloFilme: HTMLElement
  poster: HTMLImageElement
  dataLancamento: HTMLElement;
  iFrameTrailer: HTMLIFrameElement;
  sinopse: HTMLElement;
  nomesDirecao: HTMLElement
  nomesElenco: HTMLDivElement;
  primeiroGenero: HTMLElement
  divGeneros: HTMLElement

  private filmeService: FilmeService

  constructor(){
    this.filmeService = new FilmeService()
    this.registrarElementos()

    const url = new URLSearchParams(window.location.search)

    const id = url.get('id') as string
    
    this.pesquisarFilmePorId(id)
  }


  registrarElementos() {
    this.tituloFilme = document.getElementById("titulo-filme") as HTMLElement;
    this.dataLancamento = document.getElementById("data-lancamento") as HTMLElement;
    this.poster = document.getElementById("poster-filme") as HTMLImageElement;
    this.iFrameTrailer = document.getElementById("iFrameTrailer") as HTMLIFrameElement;
    this.sinopse = document.getElementById("sinopse-filme") as HTMLElement;
    this.nomesDirecao = document.getElementById("div-direcao") as HTMLDivElement;
    this.nomesElenco = document.getElementById("nomes-elenco-filme") as HTMLDivElement;
    this.primeiroGenero = document.getElementById("primeiro-genero") as HTMLElement;
    this.divGeneros = document.getElementById("div-generos") as HTMLDivElement;
  }

  pesquisarFilmePorId(id: string) {
    this.filmeService.selecionarFilmePorId(id)
      .then(filme => this.AtualizarDadosFilme(filme))
  }

  AtualizarDadosFilme(filme: Filme) {
    if (this.tituloFilme) {
        const partesData = filme.ano.split("-");
        this.tituloFilme.textContent = filme.name + " - " + partesData[0];
    }

    if (this.dataLancamento) {
        this.dataLancamento.textContent = filme.ano;
    }

    if (this.poster) {
        this.poster.src = filme.posterUrl;
    }

    if (this.iFrameTrailer && filme.videoUrl) {
        this.iFrameTrailer.src = filme.videoUrl;
    }

    if (this.sinopse) {
        this.sinopse.textContent += " " + filme.sinopse;
    }

    if (this.primeiroGenero) {
      this.primeiroGenero.textContent = filme.generos![0];
    }

    if (filme.generos!.length > 1) {
        for (let i = 1; i < filme.generos!.length; i++) {
            if (filme.generos![i]) {
                const novoElementoSpan = document.createElement("span");
                novoElementoSpan.classList.add("badge", "rounded-pill", "fs7", "px-2", "py-2", "bg-black", "text-light");
                novoElementoSpan.textContent = filme.generos![i];
                this.divGeneros.appendChild(novoElementoSpan);
            }
        }
    }

    if (filme.diretor!) {
        const novoBadge = document.createElement("span")
        novoBadge.classList.add("badge", "rounded-pill", "fs-7", "px-2", "py-2", "bg-primary", "text-dark")
        novoBadge.textContent = filme.diretor!
        this.nomesDirecao.appendChild(novoBadge)


    }

    if (filme.elenco!.length > 1) {
        for (let i = 0; i < filme.elenco!.length; i++) {
            if (filme.elenco![i]) {
                const novoBadge = document.createElement("span");
                novoBadge.classList.add("badge", "rounded-pill", "fs-7", "px-2", "py-2", "bg-secondary", "text-dark");
                novoBadge.textContent = filme.elenco![i];
                this.nomesElenco.appendChild(novoBadge);
            }
        }
    }


}


}
window.addEventListener("load", () => new DetalhesFilme())