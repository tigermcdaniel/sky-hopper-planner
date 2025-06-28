
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import type { FilterParams } from '@/pages/Index';

interface FilterSidebarProps {
  filters: FilterParams;
  onFiltersChange: (filters: FilterParams) => void;
}

export const FilterSidebar = ({ filters, onFiltersChange }: FilterSidebarProps) => {
  const updateFilter = (key: keyof FilterParams, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'stops' | 'airlines' | 'departureTime', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Range */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Price range</Label>
            <div className="px-2">
              <Slider
                value={[filters.maxPrice]}
                onValueChange={([value]) => updateFilter('maxPrice', value)}
                max={3000}
                min={0}
                step={50}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>$0</span>
                <span>${filters.maxPrice}</span>
              </div>
            </div>
          </div>

          {/* Stops */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Stops</Label>
            <div className="space-y-2">
              {[
                { value: 'nonstop', label: 'Nonstop' },
                { value: '1-stop', label: '1 stop' },
                { value: '2-stops', label: '2+ stops' }
              ].map((stop) => (
                <div key={stop.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={stop.value}
                    checked={filters.stops.includes(stop.value)}
                    onCheckedChange={() => toggleArrayFilter('stops', stop.value)}
                  />
                  <Label htmlFor={stop.value} className="text-sm cursor-pointer">
                    {stop.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Airlines */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Airlines</Label>
            <div className="space-y-2">
              {[
                { value: 'american', label: 'American Airlines' },
                { value: 'delta', label: 'Delta' },
                { value: 'united', label: 'United' },
                { value: 'southwest', label: 'Southwest' },
                { value: 'jetblue', label: 'JetBlue' }
              ].map((airline) => (
                <div key={airline.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={airline.value}
                    checked={filters.airlines.includes(airline.value)}
                    onCheckedChange={() => toggleArrayFilter('airlines', airline.value)}
                  />
                  <Label htmlFor={airline.value} className="text-sm cursor-pointer">
                    {airline.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Departure time */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Departure time</Label>
            <div className="space-y-2">
              {[
                { value: 'morning', label: 'Morning (5 AM - 12 PM)' },
                { value: 'afternoon', label: 'Afternoon (12 PM - 6 PM)' },
                { value: 'evening', label: 'Evening (6 PM - 12 AM)' }
              ].map((time) => (
                <div key={time.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={time.value}
                    checked={filters.departureTime.includes(time.value)}
                    onCheckedChange={() => toggleArrayFilter('departureTime', time.value)}
                  />
                  <Label htmlFor={time.value} className="text-sm cursor-pointer">
                    {time.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
