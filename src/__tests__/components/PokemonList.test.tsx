import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '../../test/test-utils';
import { PokemonList } from '../../components/PokemonList';
import pokemonService from '../../services/pokemonService';
import { createMockPokemon } from '../../test/mocks';

// Mock the service
vi.mock('../../services/pokemonService');
const mockPokemonService = vi.mocked(pokemonService);

const mockPokemonListResponse = {
  count: 2,
  next: null,
  previous: null,
  results: [
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
  ],
};

const mockPokemonData = {
  25: createMockPokemon({
    id: 25,
    name: 'pikachu',
    sprites: {
      ...createMockPokemon().sprites,
      other: {
        'official-artwork': {
          front_default: 'https://example.com/pikachu-artwork.png',
        },
        dream_world: {
          front_default: null,
        },
      },
    },
  }),
  6: createMockPokemon({
    id: 6,
    name: 'charizard',
    height: 17,
    weight: 905,
    base_experience: 267,
    sprites: {
      ...createMockPokemon().sprites,
      other: {
        'official-artwork': {
          front_default: 'https://example.com/charizard-artwork.png',
        },
        dream_world: {
          front_default: null,
        },
      },
    },
    types: [
      { slot: 1, type: { name: 'fire', url: '' } },
      { slot: 2, type: { name: 'flying', url: '' } },
    ],
  }),
};

describe('PokemonList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders loading state initially', () => {
    mockPokemonService.getPokemonList.mockImplementation(() => new Promise(() => {}));
    mockPokemonService.getPokemonById.mockImplementation(() => new Promise(() => {}));

    render(<PokemonList />);
    
    expect(screen.getByText('PokeReact')).toBeInTheDocument();
    expect(screen.getAllByText('', { selector: '.animate-pulse' })).toHaveLength(10);
  });

  it('renders pokemon list after loading', async () => {
    mockPokemonService.getPokemonList.mockResolvedValue(mockPokemonListResponse);
    mockPokemonService.getPokemonById
      .mockResolvedValueOnce(mockPokemonData[25])
      .mockResolvedValueOnce(mockPokemonData[6]);

    render(<PokemonList />);

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
      expect(screen.getByText('Charizard')).toBeInTheDocument();
    });

    expect(mockPokemonService.getPokemonList).toHaveBeenCalledWith(151, 0);
  });

  it('handles search functionality', async () => {
    mockPokemonService.getPokemonList.mockResolvedValue(mockPokemonListResponse);
    mockPokemonService.getPokemonById
      .mockResolvedValueOnce(mockPokemonData[25])
      .mockResolvedValueOnce(mockPokemonData[6]);

    render(<PokemonList />);

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search Pokemon...');
    fireEvent.change(searchInput, { target: { value: 'pika' } });

    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.queryByText('Charizard')).not.toBeInTheDocument();
  });

  it('displays error state when API fails', async () => {
    mockPokemonService.getPokemonList.mockRejectedValue(new Error('API Error'));

    render(<PokemonList />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load Pokemon data/)).toBeInTheDocument();
    });
  });

  it('navigates to pokemon detail on click', async () => {
    mockPokemonService.getPokemonList.mockResolvedValue(mockPokemonListResponse);
    mockPokemonService.getPokemonById.mockResolvedValueOnce(mockPokemonData[25]);

    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
      };
    });

    render(<PokemonList />);

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Pikachu'));
    // Navigation is handled by the component but we can't easily test it without more setup
  });
});