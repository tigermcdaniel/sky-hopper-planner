import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Bot, User, Plane, MapPin, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SearchParams } from '@/pages/Index';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  flightParams?: SearchParams;
  suggestions?: FlightSuggestion[];
}

interface FlightSuggestion {
  period: string;
  price: string;
  reason: string;
  dates: string;
}

interface ChatInterfaceProps {
  onFlightSearch: (params: SearchParams) => void;
}

export const ChatInterface = ({ onFlightSearch }: ChatInterfaceProps) => {
  const [userLocation, setUserLocation] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get user's location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            // Mock reverse geocoding - in real app you'd use a service like Google Maps API
            const location = await mockReverseGeocode(latitude, longitude);
            setUserLocation(location);
            
            // Add initial message with location
            const initialMessage: Message = {
              id: '1',
              role: 'assistant',
              content: `Hi! I can see you're in ${location}. I'm your flight search assistant and I can help you find the best times to travel! Just tell me where you'd like to go and I'll suggest the top 5 best times in the next 6 months to fly there.`,
              timestamp: new Date()
            };
            setMessages([initialMessage]);
          },
          () => {
            // Fallback if location is denied
            const fallbackLocation = 'New York';
            setUserLocation(fallbackLocation);
            const initialMessage: Message = {
              id: '1',
              role: 'assistant',
              content: `Hi! I'm your flight search assistant. I'll use ${fallbackLocation} as your departure city. Just tell me where you'd like to go and I'll suggest the top 5 best times in the next 6 months to fly there!`,
              timestamp: new Date()
            };
            setMessages([initialMessage]);
          }
        );
      }
    } catch (error) {
      console.log('Location error:', error);
    }
  };

  const mockReverseGeocode = async (lat: number, lng: number): Promise<string> => {
    // Mock implementation - in real app use actual geocoding service
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
    return cities[Math.floor(Math.random() * cities.length)];
  };

  const generateFlightSuggestions = (destination: string): FlightSuggestion[] => {
    const suggestions: FlightSuggestion[] = [
      {
        period: "Early February 2025",
        price: "$284",
        reason: "Off-peak travel season with lowest prices",
        dates: "Feb 5-12"
      },
      {
        period: "Mid March 2025", 
        price: "$312",
        reason: "Great weather, shoulder season pricing",
        dates: "Mar 15-22"
      },
      {
        period: "Late April 2025",
        price: "$356",
        reason: "Perfect spring weather, good deals",
        dates: "Apr 23-30"
      },
      {
        period: "Early June 2025",
        price: "$398",
        reason: "Start of summer, still reasonable prices",
        dates: "Jun 3-10"
      },
      {
        period: "Mid September 2025",
        price: "$334",
        reason: "Post-summer deals, excellent weather",
        dates: "Sep 16-23"
      }
    ];
    
    return suggestions;
  };

  const parseDestination = (userMessage: string): string | null => {
    const message = userMessage.toLowerCase();
    
    // Look for destination patterns
    const patterns = [
      /(?:to|visit|go to|travel to|fly to)\s+([a-zA-Z\s]+?)(?:\s|$|[.,!?])/,
      /^([a-zA-Z\s]+?)(?:\s|$|[.,!?])/
    ];
    
    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        const destination = match[1].trim();
        // Filter out common words that aren't destinations
        if (!['want', 'like', 'would', 'please', 'can', 'could', 'will'].includes(destination)) {
          return destination.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
        }
      }
    }
    
    return null;
  };

  const generateResponse = (userMessage: string, destination: string | null): { content: string; suggestions?: FlightSuggestion[] } => {
    if (destination) {
      const suggestions = generateFlightSuggestions(destination);
      return {
        content: `Great choice! Here are the top 5 best times to fly from ${userLocation} to ${destination} in the next 6 months:`,
        suggestions
      };
    }
    
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi')) {
      return {
        content: `Hello! I can see you're in ${userLocation}. Where would you like to travel to? I'll show you the best times to fly there!`
      };
    }
    
    if (message.includes('help')) {
      return {
        content: "I can help you find the best times to travel! Just tell me your destination city or country, and I'll show you the top 5 optimal travel periods in the next 6 months with pricing and reasons."
      };
    }
    
    return {
      content: "I'd love to help you find the best travel times! Could you tell me which city or country you'd like to visit? For example, just say 'Paris' or 'Tokyo' or 'I want to go to London'."
    };
  };

  const parseDate = (dateStr: string, year: number): Date => {
    // Parse dates like "Feb 5" or "Mar 15"
    const months: { [key: string]: number } = {
      'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
      'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
    };
    
    const parts = dateStr.toLowerCase().trim().split(' ');
    if (parts.length >= 2) {
      const monthStr = parts[0].substring(0, 3);
      const day = parseInt(parts[1]);
      
      if (months[monthStr] !== undefined && !isNaN(day)) {
        return new Date(year, months[monthStr], day);
      }
    }
    
    // Fallback to current date if parsing fails
    return new Date();
  };

  const handleSuggestionClick = (suggestion: FlightSuggestion, destination: string) => {
    const [startDate, endDate] = suggestion.dates.split('-');
    const year = 2025; // Since all suggestions are for 2025
    
    const departure = parseDate(startDate, year);
    const returnDate = parseDate(endDate, year);
    
    console.log('Parsed dates:', { departure, returnDate, startDate, endDate });
    
    const searchParams: SearchParams = {
      from: userLocation,
      to: destination,
      departure,
      return: returnDate,
      passengers: 1,
      class: 'economy',
      tripType: 'roundtrip'
    };
    
    onFlightSearch(searchParams);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    
    // Parse destination
    const destination = parseDestination(currentInput);
    
    // Generate AI response
    const { content, suggestions } = generateResponse(currentInput, destination);
    
    // Add assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content,
        timestamp: new Date(),
        suggestions
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="h-96 flex flex-col">
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-3">
              <div
                className={cn(
                  'flex gap-3 max-w-[80%]',
                  message.role === 'user' ? 'ml-auto' : 'mr-auto'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white order-2' 
                      : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={cn(
                    'rounded-lg p-3 whitespace-pre-wrap',
                    message.role === 'user'
                      ? 'bg-blue-600 text-white order-1'
                      : 'bg-gray-100 text-gray-900'
                  )}
                >
                  {message.content}
                </div>
              </div>
              
              {message.suggestions && (
                <div className="ml-11 space-y-2">
                  {message.suggestions.map((suggestion, index) => (
                    <Card 
                      key={index} 
                      className="p-3 cursor-pointer hover:bg-blue-50 transition-colors border-l-4 border-l-blue-500"
                      onClick={() => {
                        const destination = messages[messages.indexOf(message) - 1]?.content;
                        if (destination) {
                          handleSuggestionClick(suggestion, parseDestination(destination) || destination);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-gray-900">{suggestion.period}</span>
                        </div>
                        <span className="text-lg font-bold text-green-600">{suggestion.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{suggestion.reason}</p>
                      <p className="text-xs text-gray-500">Travel dates: {suggestion.dates}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-100 text-gray-900 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={userLocation ? `Where would you like to go from ${userLocation}?` : "Where would you like to travel?"}
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
