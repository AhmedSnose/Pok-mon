import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';
import pokemonService from '../services/pokemonService';
import { Pokemon } from '../types/pokemon';
import { 
  formatPokemonName, 
  getPokemonImage, 
  getTypeColor, 
  formatHeight, 
  formatWeight 
} from '../utils/pokemon';
import { useToast } from '../hooks/use-toast';

export const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const pokemonId = id ? (isNaN(Number(id)) ? id : Number(id)) : '';
  const isFavorite = typeof pokemonId === 'number' && favorites.includes(pokemonId);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('pokemon-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    const fetchPokemon = async () => {
      if (!pokemonId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await pokemonService.getPokemonById(pokemonId);
        setPokemon(data);
      } catch (err) {
        setError('Pokemon not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [pokemonId]);

  const handleFavoriteClick = () => {
    if (pokemon) {
      const newFavorites = isFavorite
        ? favorites.filter(id => id !== pokemon.id)
        : [...favorites, pokemon.id];
      
      setFavorites(newFavorites);
      localStorage.setItem('pokemon-favorites', JSON.stringify(newFavorites));
      
      toast({
        title: isFavorite ? 'Removed from favorites' : 'Added to favorites',
        description: `${formatPokemonName(pokemon.name)} ${
          isFavorite ? 'removed from' : 'added to'
        } your favorites.`,
      });
    }
  };

  const handleShare = async () => {
    if (pokemon) {
      try {
        await navigator.share({
          title: `${formatPokemonName(pokemon.name)} - Pokemon`,
          text: `Check out ${formatPokemonName(pokemon.name)}!`,
          url: window.location.href,
        });
      } catch {
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link copied!',
          description: 'Pokemon link copied to clipboard.',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-6" />
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-20" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="h-80 w-full" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <Alert variant="destructive">
          <AlertDescription>
            Pokemon not found. Please check the ID or name and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="mb-6"
        data-testid="back-button"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to List
      </Button>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-pokemon text-primary-foreground">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl">
              {formatPokemonName(pokemon.name)}
              <span className="text-xl ml-2 opacity-80">
                #{pokemon.id.toString().padStart(3, '0')}
              </span>
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleFavoriteClick}
                data-testid="favorite-detail-btn"
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Favorited' : 'Favorite'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleShare}
                data-testid="share-button"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <img
                src={getPokemonImage(pokemon)}
                alt={formatPokemonName(pokemon.name)}
                className="w-80 h-80 object-contain mb-4"
                data-testid="pokemon-image"
              />
              <div className="flex flex-wrap gap-2 justify-center">
                {pokemon.types.map((type) => (
                  <Badge
                    key={type.type.name}
                    className={`bg-${getTypeColor(type.type.name)} text-white border-0 text-lg px-4 py-1`}
                  >
                    {formatPokemonName(type.type.name)}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Height</p>
                    <p className="text-lg font-medium">{formatHeight(pokemon.height)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="text-lg font-medium">{formatWeight(pokemon.weight)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Base Experience</p>
                    <p className="text-lg font-medium">{pokemon.base_experience}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Species</p>
                    <p className="text-lg font-medium">{formatPokemonName(pokemon.species.name)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Abilities</h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map((ability) => (
                    <Badge
                      key={ability.ability.name}
                      variant={ability.is_hidden ? "secondary" : "outline"}
                      className="text-sm"
                    >
                      {formatPokemonName(ability.ability.name)}
                      {ability.is_hidden && ' (Hidden)'}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Base Stats</h3>
                <div className="space-y-3">
                  {pokemon.stats.map((stat) => (
                    <div key={stat.stat.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {formatPokemonName(stat.stat.name.replace('-', ' '))}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {stat.base_stat}
                        </span>
                      </div>
                      <Progress 
                        value={(stat.base_stat / 255) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};