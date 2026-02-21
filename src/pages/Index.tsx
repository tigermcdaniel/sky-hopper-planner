
import { useState } from 'react';
import { SearchForm } from '@/components/SearchForm';
import { FlightResults } from '@/components/FlightResults';
import { FilterSidebar } from '@/components/FilterSidebar';

import { ChatInterface } from '@/components/ChatInterface';
import { Badge } from '@/components/ui/badge';

export interface SearchParams {
  from: string;
  to: string;
  departure: Date | undefined;
  return: Date | undefined;
  passengers: number;
  class: string;
  tripType: 'roundtrip' | 'oneway';
}

export interface FilterParams {
  maxPrice: number;
  stops: string[];
  airlines: string[];
  departureTime: string[];
}

const Index = () => {
  const [searchMode, setSearchMode] = useState<'chat' | 'form'>('chat');
  const [searchParams, setSearchParams] = useState<SearchParams>({
    from: '',
    to: '',
    departure: undefined,
    return: undefined,
    passengers: 1,
    class: 'economy',
    tripType: 'roundtrip'
  });

  const [filters, setFilters] = useState<FilterParams>({
    maxPrice: 2000,
    stops: [],
    airlines: [],
    departureTime: []
  });

  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    setHasSearched(true);
    console.log('Searching flights with params:', params);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Flights</h1>
          <p className="text-gray-600 mb-6">Find the best flights for your next trip</p>
          
          <div className="flex gap-4 mb-6">
            <Badge 
              variant={searchMode === 'chat' ? 'default' : 'outline'} 
              className="cursor-pointer px-4 py-2"
              onClick={() => setSearchMode('chat')}
            >
              Chat with AI
            </Badge>
            <Badge 
              variant={searchMode === 'form' ? 'default' : 'outline'} 
              className="cursor-pointer px-4 py-2"
              onClick={() => setSearchMode('form')}
            >
              Advanced Search
            </Badge>
          </div>
          
          {searchMode === 'chat' ? (
            <ChatInterface onFlightSearch={handleSearch} />
          ) : (
            <SearchForm onSearch={handleSearch} />
          )}
        </div>

        {hasSearched && (
          <div className="flex gap-8">
            <div className="w-80 flex-shrink-0">
              <FilterSidebar filters={filters} onFiltersChange={setFilters} />
            </div>
            
            <div className="flex-1">
              <FlightResults searchParams={searchParams} filters={filters} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
