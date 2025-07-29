import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import { PokemonDetail } from '../../components/PokemonDetail';
import pokemonService from '../../services/pokemonService';
import { createMockPokemon } from '../../test/mocks';

// Mock the service
vi.mock('../../services/pokemonService');
const mockPokemonService = vi.mocked(pokemonService);

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '25' }),
    useNavigate: () => vi.fn(),
  };
});

const mockPokemon = createMockPokemon({
  abilities: [
    { ability: { name: 'static', url: '' }, is_hidden: false, slot: 1 },
    { ability: { name: 'lightning-rod', url: '' }, is_hidden: true, slot: 3 },
  ],
  stats: [
    { base_stat: 35, effort: 0, stat: { name: 'hp', url: '' } },
    { base_stat: 55, effort: 0, stat: { name: 'attack', url: '' } },
    { base_stat: 40, effort: 0, stat: { name: 'defense', url: '' } },
  ],
});

describe('PokemonDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockPokemonService.getPokemonById.mockImplementation(() => new Promise(() => {}));

    render(<PokemonDetail />);
    
    expect(screen.getByText('', { selector: '.animate-pulse' })).toBeInTheDocument();
  });

  it('renders pokemon details after loading', async () => {
    mockPokemonService.getPokemonById.mockResolvedValue(mockPokemon);

    render(<PokemonDetail />);

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });

    expect(screen.getByText('0.4 m')).toBeInTheDocument(); // Height
    expect(screen.getByText('6.0 kg')).toBeInTheDocument(); // Weight
    expect(screen.getByText('Electric')).toBeInTheDocument(); // Type
    expect(screen.getByText('112')).toBeInTheDocument(); // Base experience
    expect(screen.getByText('Static')).toBeInTheDocument(); // Ability
    expect(screen.getByText('Lightning Rod (Hidden)')).toBeInTheDocument(); // Hidden ability
    expect(screen.getByText('35')).toBeInTheDocument(); // HP stat
  });

  it('displays error state when pokemon not found', async () => {
    mockPokemonService.getPokemonById.mockRejectedValue(new Error('Not found'));

    render(<PokemonDetail />);

    await waitFor(() => {
      expect(screen.getByText(/Pokemon not found/)).toBeInTheDocument();
    });
  });

  it('displays pokemon image correctly', async () => {
    mockPokemonService.getPokemonById.mockResolvedValue(mockPokemon);

    render(<PokemonDetail />);

    await waitFor(() => {
      const image = screen.getByAltText('Pikachu');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/pikachu-artwork.png');
    });
  });

  it('formats stat names correctly', async () => {
    mockPokemonService.getPokemonById.mockResolvedValue(mockPokemon);

    render(<PokemonDetail />);

    await waitFor(() => {
      expect(screen.getByText('Hp')).toBeInTheDocument();
      expect(screen.getByText('Attack')).toBeInTheDocument();
      expect(screen.getByText('Defense')).toBeInTheDocument();
    });
  });
});