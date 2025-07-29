import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Pokemon } from '../types/pokemon';
import { formatPokemonName, getPokemonImage, getTypeColor } from '../utils/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const isFavorite = favorites.includes(pokemon.id);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('pokemon-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = isFavorite
      ? favorites.filter(id => id !== pokemon.id)
      : [...favorites, pokemon.id];
    
    setFavorites(newFavorites);
    localStorage.setItem('pokemon-favorites', JSON.stringify(newFavorites));
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:scale-105 bg-gradient-card border-border/50"
      onClick={onClick}
      data-testid={`pokemon-card-${pokemon.id}`}
    >
      <CardContent className="p-4">
        <div className="relative">
          <img
            src={getPokemonImage(pokemon)}
            alt={formatPokemonName(pokemon.name)}
            className="w-full h-32 object-contain mb-3 group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-0 right-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleFavoriteClick}
            data-testid={`favorite-btn-${pokemon.id}`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {formatPokemonName(pokemon.name)}
            </h3>
            <span className="text-sm text-muted-foreground">
              #{pokemon.id.toString().padStart(3, '0')}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {pokemon.types.map((type) => (
              <Badge
                key={type.type.name}
                variant="secondary"
                className={`bg-${getTypeColor(type.type.name)} text-white border-0`}
              >
                {formatPokemonName(type.type.name)}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Height: {(pokemon.height / 10).toFixed(1)}m</span>
            <span>Weight: {(pokemon.weight / 10).toFixed(1)}kg</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};