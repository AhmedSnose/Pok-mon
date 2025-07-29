import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "../../test/test-utils"
import { PokemonDetail } from "../../components/PokemonDetail"
import pokemonService from "../../services/pokemonService"
import { createMockPokemon } from "../../test/mocks"

// Mock the service
vi.mock("../../services/pokemonService")
const mockPokemonService = vi.mocked(pokemonService)

// Mock useParams
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useParams: () => ({ id: "25" }),
    useNavigate: () => vi.fn(),
  }
})

const mockPokemon = createMockPokemon({
  abilities: [
    { ability: { name: "static", url: "" }, is_hidden: false, slot: 1 },
    { ability: { name: "lightning-rod", url: "" }, is_hidden: true, slot: 3 },
  ],
  stats: [
    { base_stat: 35, effort: 0, stat: { name: "hp", url: "" } },
    { base_stat: 55, effort: 0, stat: { name: "attack", url: "" } },
    { base_stat: 40, effort: 0, stat: { name: "defense", url: "" } },
  ],
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

describe("PokemonDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it("renders loading state initially", () => {
    mockPokemonService.getPokemonById.mockImplementation(() => new Promise(() => {}))
    render(<PokemonDetail />)

    // Check for loading indicators
    const loadingElements = document.querySelectorAll(".animate-pulse")
    expect(loadingElements.length).toBeGreaterThan(0)
  })

  it("renders pokemon details after loading", async () => {
    mockPokemonService.getPokemonById.mockResolvedValue(mockPokemon)

    render(<PokemonDetail />)

    await waitFor(() => {
      // Use getAllByText to handle multiple "Pikachu" elements
      const pikachuElements = screen.getAllByText("Pikachu")
      expect(pikachuElements.length).toBeGreaterThan(0)
    })

    expect(screen.getByText("0.4 m")).toBeInTheDocument() // Height
    expect(screen.getByText("6.0 kg")).toBeInTheDocument() // Weight
    expect(screen.getByText("Electric")).toBeInTheDocument() // Type
    expect(screen.getByText("112")).toBeInTheDocument() // Base experience
    expect(screen.getByText("Static")).toBeInTheDocument() // Ability
    expect(screen.getByText(/Lightning-rod.*Hidden/)).toBeInTheDocument() // Hidden ability with regex
    expect(screen.getByText("35")).toBeInTheDocument() // HP stat
  })

  it("displays error state when pokemon not found", async () => {
    mockPokemonService.getPokemonById.mockRejectedValue(new Error("Not found"))

    render(<PokemonDetail />)

    await waitFor(() => {
      const errorElement =
        screen.queryByText(/Pokemon not found/i) ||
        screen.queryByText(/error/i) ||
        screen.queryByText(/failed to load/i)

      expect(errorElement).toBeInTheDocument()
    })
  })

  it("displays pokemon image correctly", async () => {
    mockPokemonService.getPokemonById.mockResolvedValue(mockPokemon)

    render(<PokemonDetail />)

    await waitFor(() => {
      const image = screen.getByTestId("pokemon-image")
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute("src", "https://example.com/pikachu-artwork.png")
    })
  })

  it("has favorite and share buttons", async () => {
    mockPokemonService.getPokemonById.mockResolvedValue(mockPokemon)

    render(<PokemonDetail />)

    await waitFor(() => {
      expect(screen.getByTestId("favorite-detail-btn")).toBeInTheDocument()
      expect(screen.getByTestId("share-button")).toBeInTheDocument()
    })
  })

  it("formats stat names correctly", async () => {
    mockPokemonService.getPokemonById.mockResolvedValue(mockPokemon)

    render(<PokemonDetail />)

    await waitFor(() => {
      expect(screen.getByText("Hp")).toBeInTheDocument()
      expect(screen.getByText("Attack")).toBeInTheDocument()
      expect(screen.getByText("Defense")).toBeInTheDocument()
    })
  })
})
