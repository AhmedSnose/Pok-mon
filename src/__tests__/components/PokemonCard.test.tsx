"use client"

import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "../../test/test-utils"
import { PokemonCard } from "../../components/PokemonCard"
import { createMockPokemon } from "../../test/mocks"

const mockPokemon = createMockPokemon({
  types: [
    { slot: 1, type: { name: "electric", url: "" } },
    { slot: 2, type: { name: "normal", url: "" } },
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

describe("PokemonCard", () => {
  const mockOnClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it("renders pokemon information correctly", () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    expect(screen.getByText("Pikachu")).toBeInTheDocument()
    expect(screen.getByText("#025")).toBeInTheDocument()

    // Use more flexible text matching for height and weight
    expect(screen.getByText(/Height:.*0\.4.*m/)).toBeInTheDocument()
    expect(screen.getByText(/Weight:.*6\.0.*kg/)).toBeInTheDocument()

    expect(screen.getByText("Electric")).toBeInTheDocument()
    expect(screen.getByText("Normal")).toBeInTheDocument()
  })

  it("displays pokemon image", () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    const image = screen.getByAltText("Pikachu")
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", "https://example.com/pikachu-artwork.png")
  })

  it("calls onClick when card is clicked", () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    fireEvent.click(screen.getByText("Pikachu"))
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it("toggles favorite status when heart is clicked", () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    const favoriteButton = screen.getByTestId("favorite-btn-25")

    expect(favoriteButton).toBeInTheDocument()

    fireEvent.click(favoriteButton)

    expect(localStorageMock.setItem).toHaveBeenCalledWith("pokemon-favorites", JSON.stringify([25]))

    fireEvent.click(favoriteButton)

    expect(localStorageMock.setItem).toHaveBeenCalledWith("pokemon-favorites", JSON.stringify([]))
  })

  it("loads favorite status from localStorage", () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([25]))

    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    expect(localStorageMock.getItem).toHaveBeenCalledWith("pokemon-favorites")
  })

  it("prevents card click when favorite button is clicked", () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    const favoriteButton = screen.getByTestId("favorite-btn-25")
    fireEvent.click(favoriteButton)

    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it("applies correct type colors", () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    const electricType = screen.getByText("Electric")
    expect(electricType).toHaveClass("bg-type-electric")

    const normalType = screen.getByText("Normal")
    expect(normalType).toHaveClass("bg-type-normal")
  })
})
