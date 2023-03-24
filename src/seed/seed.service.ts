import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  async seedExecuted() {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=650');
    const data: PokeResponse = await res.json();

    const pokemons = data.results.map((pokemon) => {
      const segments = pokemon.url.split('/');
      const no = segments[segments.length - 2];
      return {
        name: pokemon.name,
        no: +no,
      };
    });
    return pokemons;
  }
}
