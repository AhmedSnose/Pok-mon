import { describe, it, expect } from 'vitest';
import {
  getPokemonIdFromUrl,
  formatPokemonName,
  getPokemonImage,
  getTypeColor,
  formatHeight,
  formatWeight,
} from '../../utils/pokemon';

describe('Pokemon Utilities', () => {
  describe('getPokemonIdFromUrl', () => {
    it('extracts ID from valid Pokemon URL', () => {
      const url = 'https://pokeapi.co/api/v2/pokemon/25/';
      expect(getPokemonIdFromUrl(url)).toBe(25);
    });

    it('returns 0 for invalid URL', () => {
      const url = 'https://invalid-url.com';
      expect(getPokemonIdFromUrl(url)).toBe(0);
    });

    it('handles different ID formats', () => {
      expect(getPokemonIdFromUrl('https://pokeapi.co/api/v2/pokemon/1/')).toBe(1);
      expect(getPokemonIdFromUrl('https://pokeapi.co/api/v2/pokemon/151/')).toBe(151);
    });
  });

  describe('formatPokemonName', () => {
    it('capitalizes first letter of name', () => {
      expect(formatPokemonName('pikachu')).toBe('Pikachu');
      expect(formatPokemonName('charizard')).toBe('Charizard');
    });

    it('handles empty string', () => {
      expect(formatPokemonName('')).toBe('');
    });

    it('handles single character', () => {
      expect(formatPokemonName('a')).toBe('A');
    });
  });

  describe('getPokemonImage', () => {
    it('returns official artwork if available', () => {
      const pokemon = {
        sprites: {
          front_default: 'https://example.com/sprite.png',
          other: {
            'official-artwork': {
              front_default: 'https://example.com/artwork.png',
            },
          },
        },
      } as any;

      expect(getPokemonImage(pokemon)).toBe('https://example.com/artwork.png');
    });

    it('falls back to front_default if no artwork', () => {
      const pokemon = {
        sprites: {
          front_default: 'https://example.com/sprite.png',
          other: null,
        },
      } as any;

      expect(getPokemonImage(pokemon)).toBe('https://example.com/sprite.png');
    });

    it('returns placeholder if no images available', () => {
      const pokemon = {
        sprites: {
          front_default: null,
          other: null,
        },
      } as any;

      expect(getPokemonImage(pokemon)).toBe('/placeholder.svg');
    });
  });

  describe('getTypeColor', () => {
    it('returns correct color class for known types', () => {
      expect(getTypeColor('fire')).toBe('type-fire');
      expect(getTypeColor('water')).toBe('type-water');
      expect(getTypeColor('electric')).toBe('type-electric');
    });

    it('returns muted for unknown types', () => {
      expect(getTypeColor('unknown')).toBe('muted');
      expect(getTypeColor('')).toBe('muted');
    });
  });

  describe('formatHeight', () => {
    it('converts height from decimeters to meters', () => {
      expect(formatHeight(4)).toBe('0.4 m');
      expect(formatHeight(17)).toBe('1.7 m');
      expect(formatHeight(10)).toBe('1.0 m');
    });

    it('handles zero height', () => {
      expect(formatHeight(0)).toBe('0.0 m');
    });
  });

  describe('formatWeight', () => {
    it('converts weight from hectograms to kilograms', () => {
      expect(formatWeight(60)).toBe('6.0 kg');
      expect(formatWeight(905)).toBe('90.5 kg');
      expect(formatWeight(10)).toBe('1.0 kg');
    });

    it('handles zero weight', () => {
      expect(formatWeight(0)).toBe('0.0 kg');
    });
  });
});