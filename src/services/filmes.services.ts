import { API_KEY } from "../../secrets"
import { Filme } from "../models/Filme"

export class FilmeService{
  
  nPage: number
  page: string

  constructor(){
    this.page = "1"
    this.nPage = Number(this.page)
  }

  obterHeaderAutorizacao(){
    return {method: "GET",
      headers: {
        accept: "application/json",
        Authorization:`Bearer ${API_KEY}`},
    }
  }

  async selecionarFilmes(): Promise<Filme[]> {
    return await fetch("https://api.themoviedb.org/3/movie/popular?language=pt-BR&page="+this.page, this.obterHeaderAutorizacao())
      .then((obj: Response): Promise<any> => this.processarResposta(obj))
      .then((filme: any): Filme[] => this.mapearListaFilmes(filme.results))
  }

  async selecionarFilmePorId(id: string){
    const url = 'https://api.themoviedb.org/3/movie/' + id + '?language=pt-BR';

    return fetch(url,this.obterHeaderAutorizacao())
      .then(res => res.json())
      .then((obj: any): Promise<Filme> => this.mapearFilme(obj));
  }

  async mapearFilme(obj: any): Promise<Filme>{
    console.log(obj)
    const nomesGeneros = obj.genres.map((genero: any) => genero.name);

    const diretor = await this.pesquisarDiretor(obj.id)
    const elenco = await this.pesquisarElenco(obj.id)

    const link = await this.pequisarVideo(obj.id)
        console.log(link)
        let key = ""
        if (link == undefined) key = "https://www.youtube.com"
        else key = link.key as string

    return{
      id: obj.id,
      name: obj.title,
      posterUrl: "https://image.tmdb.org/t/p/original/"+obj.poster_path,
      videoUrl: "https://www.youtube.com/embed/" + key,
      sinopse: obj.overview,
      generos: nomesGeneros,
      ano: obj.release_date,
      diretor: diretor,
      elenco: elenco

    }
  }

  mapearListaFilmes(objetos: any[]): Filme[]{
    return objetos.map(obj => {
      return{
        id: obj.id,
        name: obj.title,
        posterUrl: "https://image.tmdb.org/t/p/original/"+obj.poster_path,
        sinopse: obj.overview,
        ano: obj.release_date,
      }
    })     
  }

  processarResposta(response: Response) : Promise<any>{
    if(response.ok) return response.json()
    throw new Error('Filme não encontrado!')
  }

  async pesquisarDiretor(id: any): Promise<any> {
    const url = `https://api.themoviedb.org/3/movie/${id}/credits?language=pt-BR`;

    const response = await fetch(url, this.obterHeaderAutorizacao());
    const data = await response.json();

    let diretor = null;
    for (const crewMember of data.crew) {
      if (crewMember.department === "Directing") {
          diretor = crewMember.name;
          break;
      }
    }
    return diretor as string;
  }
  async pesquisarElenco(id: any): Promise<any[]> {
    const url = `https://api.themoviedb.org/3/movie/${id}/credits?language=pt-BR`;

    const response = await fetch(url, this.obterHeaderAutorizacao())
    const data = await response.json()

    if (data.cast && data.cast.length >= 10) {
      return data.cast.slice(0, 10).map((membro: any) => membro.name)
    } else {
      console.log("Não há informações suficientes no elenco.")
      return []
    }
  }

  pequisarVideo(id: any): Promise<any> {
    const url = 'https://api.themoviedb.org/3/movie/' + id + '/videos?language=pt-BR'

    return fetch(url, this.obterHeaderAutorizacao())
      .then(res => res.json())
      .then(data => {
        return data.results[data.results.length - 1] as string;
      })
  }
}