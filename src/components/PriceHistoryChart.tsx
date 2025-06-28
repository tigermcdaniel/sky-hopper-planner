
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Info } from 'lucide-react';

interface PriceHistoryChartProps {
  destination: string;
  currentPrice: number;
}

const generatePriceHistory = (basePrice: number) => {
  const days = [48, 42, 36, 30, 24, 18, 12, 6];
  return days.map(daysAgo => ({
    daysAgo: `${daysAgo} days ago`,
    price: Math.round(basePrice + (Math.random() - 0.5) * 100),
    date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toLocaleDateString()
  }));
};

const chartConfig = {
  price: {
    label: "Price",
    color: "#2563eb",
  },
};

export const PriceHistoryChart = ({ destination, currentPrice }: PriceHistoryChartProps) => {
  const priceHistory = generatePriceHistory(currentPrice);
  const minPrice = Math.min(...priceHistory.map(p => p.price));
  const maxPrice = Math.max(...priceHistory.map(p => p.price));
  const avgPrice = Math.round(priceHistory.reduce((sum, p) => sum + p.price, 0) / priceHistory.length);
  const savings = avgPrice - currentPrice;

  return (
    <div className="space-y-4">
      {/* Price Insight Banner */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900">
                The cheapest time to book is usually earlier, up to 6 months before takeoff
              </p>
              <p className="text-blue-700 text-sm mt-1">
                Prices during this time for similar trips to {destination} are ${Math.abs(savings)} {savings > 0 ? 'cheaper' : 'more expensive'} on average.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Price Status */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Prices are currently {currentPrice <= avgPrice ? 'below average' : 'typical'} for your search
              </h3>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                  ${currentPrice} is {currentPrice <= avgPrice ? 'below average' : 'typical'}
                </Badge>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>The least expensive flights for similar trips to {destination}</p>
              <p>usually cost between ${minPrice}–${maxPrice}.</p>
            </div>

            {/* Price Range Indicator */}
            <div className="relative">
              <div className="h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full"></div>
              <div 
                className="absolute top-0 w-3 h-3 bg-blue-600 rounded-full border-2 border-white transform -translate-y-0.5"
                style={{ 
                  left: `${((currentPrice - minPrice) / (maxPrice - minPrice)) * 100}%`,
                  marginLeft: '-6px'
                }}
              ></div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>${minPrice}</span>
                <span>${maxPrice}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price History Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price history for this search</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <LineChart data={priceHistory} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis 
                dataKey="daysAgo" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                domain={[minPrice - 20, maxPrice + 20]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`$${value}`, 'Price']}
                labelFormatter={(label) => `${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
              />
              <ReferenceLine 
                y={avgPrice} 
                stroke="#6b7280" 
                strokeDasharray="3 3"
                label={{ value: `Avg: $${avgPrice}`, position: 'right' }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
