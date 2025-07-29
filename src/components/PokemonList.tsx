import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { PokemonCard } from './PokemonCard';
import pokemonService from '../services/pokemonService';
import { Pokemon, PokemonListResponse } from '../types/pokemon';
import { getPokemonIdFromUrl } from '../utils/pokemon';

const ITEMS_PER_PAGE = 20;

export const PokemonList: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemonList, setPokemonList] = useState<PokemonListResponse | null>(null);
  const [pokemonData, setPokemonData] = useState<Record<number, Pokemon>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await pokemonService.getPokemonList(ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
        setPokemonList(data);
        
        // Fetch individual Pokemon data
        const pokemonPromises = data.results.map(async (pokemon) => {
          const id = getPokemonIdFromUrl(pokemon.url);
          try {
            const pokemonDetail = await pokemonService.getPokemonById(id);
            return { id, data: pokemonDetail };
          } catch {
            return null;
          }
        });
        
        const pokemonResults = await Promise.all(pokemonPromises);
        const newPokemonData: Record<number, Pokemon> = {};
        pokemonResults.forEach((result) => {
          if (result) {
            newPokemonData[result.id] = result.data;
          }
        });
        setPokemonData(newPokemonData);
      } catch (err) {
        setError('Failed to load Pokemon data');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonList();
  }, [currentPage]);

  const handlePokemonClick = (pokemonId: number) => {
    navigate(`/pokemon/${pokemonId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const searchValue = searchTerm.toLowerCase().trim();
      navigate(`/pokemon/${searchValue}`);
    }
  };

  const totalPages = pokemonList ? Math.ceil(pokemonList.count / ITEMS_PER_PAGE) : 0;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            {error}. Please check your internet connection and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Card className="bg-gradient-pokemon text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            Pokemon Explorer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/90 border-white/20 text-foreground"
                data-testid="search-input"
              />
            </div>
            <Button 
              type="submit" 
              variant="secondary"
              disabled={!searchTerm.trim()}
              data-testid="search-button"
            >
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <Skeleton className="h-32 w-full mb-3" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <div className="flex gap-2 mb-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pokemonList?.results.map((pokemon) => {
              const pokemonId = getPokemonIdFromUrl(pokemon.url);
              const pokemonDetail = pokemonData[pokemonId];
              
              if (!pokemonDetail) {
                return (
                  <Card key={pokemon.name}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center h-32 mb-3">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                      <div className="text-center text-muted-foreground">
                        Loading {pokemon.name}...
                      </div>
                    </CardContent>
                  </Card>
                );
              }
              
              return (
                <PokemonCard
                  key={pokemon.name}
                  pokemon={pokemonDetail}
                  onClick={() => handlePokemonClick(pokemonId)}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              data-testid="prev-button"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <span className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              data-testid="next-button"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};