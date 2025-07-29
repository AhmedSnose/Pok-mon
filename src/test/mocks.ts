import { Pokemon } from '../types/pokemon';

export const createMockPokemon = (overrides: Partial<Pokemon> = {}): Pokemon => {
  return {
    id: 25,
    name: 'pikachu',
    height: 4,
    weight: 60,
    base_experience: 112,
    sprites: {
      front_default: 'https://example.com/pikachu.png',
      front_shiny: null,
      front_female: null,
      front_shiny_female: null,
      back_default: null,
      back_shiny: null,
      back_female: null,
      back_shiny_female: null,
      other: {
        'official-artwork': {
          front_default: 'https://example.com/pikachu-artwork.png',
        },
        dream_world: {
          front_default: null,
        },
      },
    },
    types: [{ slot: 1, type: { name: 'electric', url: '' } }],
    abilities: [
      { ability: { name: 'static', url: '' }, is_hidden: false, slot: 1 },
    ],
    stats: [
      { base_stat: 35, effort: 0, stat: { name: 'hp', url: '' } },
      { base_stat: 55, effort: 0, stat: { name: 'attack', url: '' } },
      { base_stat: 40, effort: 0, stat: { name: 'defense', url: '' } },
    ],
    species: { name: 'pikachu', url: '' },
    ...overrides,
  };
};