
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plane, Clock, Users } from 'lucide-react';
import type { SearchParams, FilterParams } from '@/pages/Index';

interface FlightResultsProps {
  searchParams: SearchParams;
  filters: FilterParams;
}

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    time: string;
    airport: string;
    city: string;
  };
  arrival: {
    time: string;
    airport: string;
    city: string;
  };
  duration: string;
  stops: number;
  price: number;
  class: string;
}

const mockFlights: Flight[] = [
  {
    id: '1',
    airline: 'American Airlines',
    flightNumber: 'AA 1234',
    departure: { time: '8:00 AM', airport: 'LAX', city: 'Los Angeles' },
    arrival: { time: '4:30 PM', airport: 'JFK', city: 'New York' },
    duration: '5h 30m',
    stops: 0,
    price: 328,
    class: 'Economy'
  },
  {
    id: '2',
    airline: 'Delta',
    flightNumber: 'DL 5678',
    departure: { time: '10:15 AM', airport: 'LAX', city: 'Los Angeles' },
    arrival: { time: '7:45 PM', airport: 'JFK', city: 'New York' },
    duration: '6h 30m',
    stops: 1,
    price: 285,
    class: 'Economy'
  },
  {
    id: '3',
    airline: 'United',
    flightNumber: 'UA 9012',
    departure: { time: '2:30 PM', airport: 'LAX', city: 'Los Angeles' },
    arrival: { time: '10:15 PM', airport: 'JFK', city: 'New York' },
    duration: '5h 45m',
    stops: 0,
    price: 445,
    class: 'Economy'
  },
  {
    id: '4',
    airline: 'JetBlue',
    flightNumber: 'B6 3456',
    departure: { time: '6:45 AM', airport: 'LAX', city: 'Los Angeles' },
    arrival: { time: '3:20 PM', airport: 'JFK', city: 'New York' },
    duration: '5h 35m',
    stops: 0,
    price: 392,
    class: 'Economy'
  }
];

export const FlightResults = ({ searchParams, filters }: FlightResultsProps) => {
  const filteredFlights = mockFlights.filter(flight => {
    if (flight.price > filters.maxPrice) return false;
    if (filters.stops.length > 0) {
      const stopFilter = flight.stops === 0 ? 'nonstop' : flight.stops === 1 ? '1-stop' : '2-stops';
      if (!filters.stops.includes(stopFilter)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {searchParams.from} → {searchParams.to}
        </h2>
        <p className="text-gray-600">
          {filteredFlights.length} flight{filteredFlights.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {filteredFlights.map((flight) => (
        <Card key={flight.id} className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-semibold text-gray-900">
                      {flight.airline}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {flight.flightNumber}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      ${flight.price}
                    </div>
                    <div className="text-sm text-gray-600">
                      per person
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-6">
                    <div>
                      <div className="text-xl font-semibold text-gray-900">
                        {flight.departure.time}
                      </div>
                      <div className="text-sm text-gray-600">
                        {flight.departure.airport}
                      </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center relative">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{flight.duration}</span>
                      </div>
                      <div className="absolute inset-x-0 top-1/2 h-px bg-gray-300"></div>
                      <Plane className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-blue-600 bg-white" />
                    </div>

                    <div>
                      <div className="text-xl font-semibold text-gray-900">
                        {flight.arrival.time}
                      </div>
                      <div className="text-sm text-gray-600">
                        {flight.arrival.airport}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>
                      {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                    </span>
                    <span>•</span>
                    <span>{flight.class}</span>
                  </div>
                  
                  <Button className="bg-blue-600 hover:bg-blue-700 px-6">
                    Select flight
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredFlights.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Plane className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No flights found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search criteria to find more options.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
