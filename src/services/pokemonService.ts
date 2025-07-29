// Simple Pokemon service without RTK Query
import config from '../config/env';
import { Pokemon, PokemonListResponse } from '../types/pokemon';

const BASE_URL = config.baseApiUrl;

export const pokemonService = {
  async getPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon list');
    }
    return response.json();
  },

  async getPokemonById(id: string | number): Promise<Pokemon> {
    const response = await fetch(`${BASE_URL}/pokemon/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon with id: ${id}`);
    }
    return response.json();
  },
};

export default pokemonService;