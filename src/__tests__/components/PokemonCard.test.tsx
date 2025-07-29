import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import { PokemonCard } from '../../components/PokemonCard';
import { createMockPokemon } from '../../test/mocks';

const mockPokemon = createMockPokemon({
  types: [
    { slot: 1, type: { name: 'electric', url: '' } },
    { slot: 2, type: { name: 'normal', url: '' } },
  ],
});

describe('PokemonCard', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders pokemon information correctly', () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />);

    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('#025')).toBeInTheDocument();
    expect(screen.getByText('0.4 m')).toBeInTheDocument();
    expect(screen.getByText('6.0 kg')).toBeInTheDocument();
    expect(screen.getByText('Electric')).toBeInTheDocument();
    expect(screen.getByText('Normal')).toBeInTheDocument();
  });

  it('displays pokemon image', () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />);

    const image = screen.getByAltText('Pikachu');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/pikachu-artwork.png');
  });

  it('calls onClick when card is clicked', () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />);

    fireEvent.click(screen.getByText('Pikachu'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('toggles favorite status when heart is clicked', () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />);

    const favoriteButton = screen.getByRole('button');
    
    // Initially not favorited
    expect(favoriteButton).toBeInTheDocument();

    // Click to favorite
    fireEvent.click(favoriteButton);
    
    // Check localStorage was called
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'pokemon-favorites',
      JSON.stringify([25])
    );

    // Click again to unfavorite
    fireEvent.click(favoriteButton);
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'pokemon-favorites',
      JSON.stringify([])
    );
  });

  it('loads favorite status from localStorage', () => {
    // Mock localStorage to return favorite
    (localStorage.getItem as any).mockReturnValue(JSON.stringify([25]));

    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />);

    expect(localStorage.getItem).toHaveBeenCalledWith('pokemon-favorites');
  });

  it('prevents card click when favorite button is clicked', () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />);

    const favoriteButton = screen.getByRole('button');
    fireEvent.click(favoriteButton);

    // Card onClick should not be called when favorite button is clicked
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('applies correct type colors', () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />);

    const electricType = screen.getByText('Electric');
    expect(electricType).toHaveClass('type-electric');

    const normalType = screen.getByText('Normal');
    expect(normalType).toHaveClass('type-normal');
  });
});