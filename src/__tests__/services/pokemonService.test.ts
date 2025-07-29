import { describe, it, expect, vi, beforeEach } from 'vitest';
import pokemonService from '../../services/pokemonService';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('PokemonService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPokemonList', () => {
    it('fetches pokemon list successfully', async () => {
      const mockResponse = {
        count: 1302,
        next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
        previous: null,
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await pokemonService.getPokemonList(20, 0);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0'
      );
      expect(result).toEqual(mockResponse);
    });

    it('throws error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(pokemonService.getPokemonList()).rejects.toThrow(
        'Failed to fetch Pokemon list'
      );
    });

    it('uses default parameters when none provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await pokemonService.getPokemonList();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0'
      );
    });
  });

  describe('getPokemonById', () => {
    it('fetches pokemon by numeric ID successfully', async () => {
      const mockPokemon = {
        id: 25,
        name: 'pikachu',
        height: 4,
        weight: 60,
        types: [{ slot: 1, type: { name: 'electric' } }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemon,
      });

      const result = await pokemonService.getPokemonById(25);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/25'
      );
      expect(result).toEqual(mockPokemon);
    });

    it('fetches pokemon by string ID successfully', async () => {
      const mockPokemon = {
        id: 25,
        name: 'pikachu',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemon,
      });

      const result = await pokemonService.getPokemonById('pikachu');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/pikachu'
      );
      expect(result).toEqual(mockPokemon);
    });

    it('throws error when pokemon not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(pokemonService.getPokemonById(999)).rejects.toThrow(
        'Failed to fetch Pokemon with id: 999'
      );
    });

    it('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(pokemonService.getPokemonById(1)).rejects.toThrow(
        'Network error'
      );
    });
  });
});