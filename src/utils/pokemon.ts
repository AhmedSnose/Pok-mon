import { Pokemon } from '../types/pokemon';

// Utility functions for Pokemon data manipulation
export const getPokemonIdFromUrl = (url: string): number => {
  const matches = url.match(/\/(\d+)\/$/);
  return matches ? parseInt(matches[1], 10) : 0;
};

export const formatPokemonName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export const getPokemonImage = (pokemon: Pokemon): string => {
  if (pokemon.sprites.other && pokemon.sprites.other['official-artwork'] && pokemon.sprites.other['official-artwork'].front_default) {
    return pokemon.sprites.other['official-artwork'].front_default;
  }
  return pokemon.sprites.front_default || '/placeholder.svg';
};

export const getTypeColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    fire: 'type-fire',
    water: 'type-water',
    grass: 'type-grass',
    electric: 'type-electric',
    psychic: 'type-psychic',
    ice: 'type-ice',
    dragon: 'type-dragon',
    dark: 'type-dark',
    fighting: 'type-fighting',
    poison: 'type-poison',
    ground: 'type-ground',
    flying: 'type-flying',
    bug: 'type-bug',
    rock: 'type-rock',
    ghost: 'type-ghost',
    steel: 'type-steel',
    normal: 'type-normal',
  };
  
  return typeColors[type] || 'muted';
};

export const formatHeight = (height: number): string => {
  return `${(height / 10).toFixed(1)} m`;
};

export const formatWeight = (weight: number): string => {
  return `${(weight / 10).toFixed(1)} kg`;
};