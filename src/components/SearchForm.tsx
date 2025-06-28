
import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, MapPin, Users, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { SearchParams } from '@/pages/Index';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
}

export const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departure, setDeparture] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState('economy');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      from,
      to,
      departure,
      return: tripType === 'roundtrip' ? returnDate : undefined,
      passengers,
      class: travelClass,
      tripType
    });
  };

  const swapCities = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardContent className="p-6">
        <div className="flex gap-4 mb-6">
          <Badge 
            variant={tripType === 'roundtrip' ? 'default' : 'outline'} 
            className="cursor-pointer px-4 py-2"
            onClick={() => setTripType('roundtrip')}
          >
            Round trip
          </Badge>
          <Badge 
            variant={tripType === 'oneway' ? 'default' : 'outline'} 
            className="cursor-pointer px-4 py-2"
            onClick={() => setTripType('oneway')}
          >
            One way
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Label htmlFor="from" className="text-sm font-medium text-gray-700 mb-2 block">
                Where from?
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="from"
                  placeholder="Origin city or airport"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="pl-10 h-12 text-lg"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <Label htmlFor="to" className="text-sm font-medium text-gray-700 mb-2 block">
                Where to?
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="to"
                  placeholder="Destination city or airport"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="pl-10 h-12 text-lg"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2"
                  onClick={swapCities}
                >
                  <Plane className="h-4 w-4 rotate-90" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Departure
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12",
                      !departure && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {departure ? format(departure, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={departure}
                    onSelect={setDeparture}
                    initialFocus
                    className="pointer-events-auto"
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {tripType === 'roundtrip' && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Return
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !returnDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      {returnDate ? format(returnDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      initialFocus
                      className="pointer-events-auto"
                      disabled={(date) => date < new Date() || (departure && date < departure)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Travelers & Class
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-12 justify-start">
                    <Users className="mr-2 h-5 w-5" />
                    {passengers} passenger{passengers > 1 ? 's' : ''}, {travelClass}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Passengers</Label>
                      <div className="flex items-center justify-between mt-2">
                        <span>Adults</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPassengers(Math.max(1, passengers - 1))}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{passengers}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPassengers(passengers + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Class</Label>
                      <Select value={travelClass} onValueChange={setTravelClass}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="economy">Economy</SelectItem>
                          <SelectItem value="premium-economy">Premium economy</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="first">First</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700">
            Search flights
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
