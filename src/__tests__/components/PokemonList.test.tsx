import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor, fireEvent } from "../../test/test-utils"
import { PokemonList } from "../../components/PokemonList"
import pokemonService from "../../services/pokemonService"
import { createMockPokemon } from "../../test/mocks"

// Mock the navigate function
const mockNavigate = vi.fn()

// Mock react-router-dom at the top level
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock the service
vi.mock("../../services/pokemonService")
const mockPokemonService = vi.mocked(pokemonService)

const mockPokemonListResponse = {
  count: 2,
  next: null,
  previous: null,
  results: [
    { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
    { name: "charizard", url: "https://pokeapi.co/api/v2/pokemon/6/" },
  ],
}

const mockPokemonData = {
  25: createMockPokemon({
    id: 25,
    name: "pikachu",
    sprites: {
      ...createMockPokemon().sprites,
      other: {
        "official-artwork": {
          front_default: "https://example.com/pikachu-artwork.png",
        },
        dream_world: {
          front_default: null,
        },
      },
    },
  }),
  6: createMockPokemon({
    id: 6,
    name: "charizard",
    height: 17,
    weight: 905,
    base_experience: 267,
    sprites: {
      ...createMockPokemon().sprites,
      other: {
        "official-artwork": {
          front_default: "https://example.com/charizard-artwork.png",
        },
        dream_world: {
          front_default: null,
        },
      },
    },
    types: [
      { slot: 1, type: { name: "fire", url: "" } },
      { slot: 2, type: { name: "flying", url: "" } },
    ],
  }),
}

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

describe("PokemonList", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
    localStorageMock.getItem.mockReturnValue(null)
    mockNavigate.mockClear()
  })

  it("renders loading state initially", async () => {
    // Mock services to return pending promises
    mockPokemonService.getPokemonList.mockImplementation(() => new Promise(() => {}))
    mockPokemonService.getPokemonById.mockImplementation(() => new Promise(() => {}))

    render(<PokemonList />)

    // Check for the actual title in your component
    expect(screen.getByText("Pokemon Explorer")).toBeInTheDocument()

    // Check for loading skeletons
    const loadingElements = document.querySelectorAll(".animate-pulse")
    expect(loadingElements.length).toBeGreaterThan(0)
  })

  it("renders pokemon list after loading", async () => {
    mockPokemonService.getPokemonList.mockResolvedValue(mockPokemonListResponse)
    mockPokemonService.getPokemonById
      .mockResolvedValueOnce(mockPokemonData[25])
      .mockResolvedValueOnce(mockPokemonData[6])

    render(<PokemonList />)

    await waitFor(
      () => {
        expect(screen.getByText("Pikachu")).toBeInTheDocument()
        expect(screen.getByText("Charizard")).toBeInTheDocument()
      },
      { timeout: 3000 },
    )

    // Check the actual API call parameters based on your component
    expect(mockPokemonService.getPokemonList).toHaveBeenCalledWith(20, 0)
  })

  it("displays error state when API fails", async () => {
    mockPokemonService.getPokemonList.mockRejectedValue(new Error("API Error"))

    render(<PokemonList />)

    await waitFor(
      () => {
        // Use a more flexible text matcher for the error message
        expect(screen.getByText(/Failed to load Pokemon data/i)).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })

  it("handles search form submission", async () => {
    mockPokemonService.getPokemonList.mockImplementation(() => new Promise(() => {}))

    render(<PokemonList />)

    const searchInput = screen.getByTestId("search-input")
    const searchButton = screen.getByTestId("search-button")

    // Initially search button should be disabled
    expect(searchButton).toBeDisabled()

    // Type in search input
    fireEvent.change(searchInput, { target: { value: "pikachu" } })

    // Button should now be enabled
    expect(searchButton).not.toBeDisabled()

    // Submit the form
    fireEvent.click(searchButton)

    // Check if navigate was called with the search term
    expect(mockNavigate).toHaveBeenCalledWith("/pokemon/pikachu")
  })

  it("handles pagination", async () => {
    const mockResponse = {
      count: 100,
      next: "next-url",
      previous: null,
      results: [mockPokemonListResponse.results[0]],
    }

    mockPokemonService.getPokemonList.mockResolvedValue(mockResponse)
    mockPokemonService.getPokemonById.mockResolvedValue(mockPokemonData[25])

    render(<PokemonList />)

    await waitFor(() => {
      expect(screen.getByText("Pikachu")).toBeInTheDocument()
    })

    // Check pagination controls
    const nextButton = screen.getByTestId("next-button")
    const prevButton = screen.getByTestId("prev-button")

    expect(prevButton).toBeDisabled() // Should be disabled on first page
    expect(nextButton).not.toBeDisabled()

    // Check page indicator
    expect(screen.getByText("Page 1 of 5")).toBeInTheDocument()
  })

  it("shows pokemon count or title", () => {
    mockPokemonService.getPokemonList.mockImplementation(() => new Promise(() => {}))

    render(<PokemonList />)

    // Check for the actual title in your component
    expect(screen.getByText("Pokemon Explorer")).toBeInTheDocument()
  })

  it("handles empty pokemon list", async () => {
    const emptyResponse = {
      count: 0,
      next: null,
      previous: null,
      results: [],
    }

    mockPokemonService.getPokemonList.mockResolvedValue(emptyResponse)

    render(<PokemonList />)

    await waitFor(() => {
      // Check that no pokemon are displayed
      expect(screen.queryByText("Pikachu")).not.toBeInTheDocument()
      expect(screen.queryByText("Charizard")).not.toBeInTheDocument()
    })

    // Check pagination shows 0 pages
    expect(screen.getByText("Page 1 of 0")).toBeInTheDocument()
  })
})
