
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Bot, User, Plane } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SearchParams } from '@/pages/Index';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  flightParams?: SearchParams;
}

interface ChatInterfaceProps {
  onFlightSearch: (params: SearchParams) => void;
}

export const ChatInterface = ({ onFlightSearch }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your flight search assistant. I can help you find flights by asking about your travel plans. Where would you like to go?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseFlightRequest = (userMessage: string): SearchParams | null => {
    const message = userMessage.toLowerCase();
    
    // Simple pattern matching for flight searches
    const fromMatch = message.match(/from\s+([a-zA-Z\s]+?)(?:\s+to|\s+destination|$)/);
    const toMatch = message.match(/to\s+([a-zA-Z\s]+?)(?:\s+on|\s+departure|\s+leaving|$)/);
    
    // Date patterns
    const datePatterns = [
      /(\d{1,2}\/\d{1,2}\/\d{4})/,
      /(\d{1,2}-\d{1,2}-\d{4})/,
      /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}/i,
      /(tomorrow|today|next week|next month)/i
    ];
    
    let departureDate: Date | undefined;
    for (const pattern of datePatterns) {
      const match = message.match(pattern);
      if (match) {
        if (match[1] === 'tomorrow') {
          departureDate = new Date();
          departureDate.setDate(departureDate.getDate() + 1);
        } else if (match[1] === 'today') {
          departureDate = new Date();
        } else {
          departureDate = new Date(match[1]);
        }
        break;
      }
    }
    
    // Passenger count
    const passengerMatch = message.match(/(\d+)\s+passenger/);
    const passengers = passengerMatch ? parseInt(passengerMatch[1]) : 1;
    
    // Trip type
    const isRoundTrip = message.includes('round trip') || message.includes('roundtrip') || message.includes('return');
    
    if (fromMatch && toMatch) {
      return {
        from: fromMatch[1].trim(),
        to: toMatch[1].trim(),
        departure: departureDate,
        return: isRoundTrip ? departureDate : undefined,
        passengers,
        class: 'economy',
        tripType: isRoundTrip ? 'roundtrip' : 'oneway'
      };
    }
    
    return null;
  };

  const generateResponse = (userMessage: string, flightParams: SearchParams | null): string => {
    if (flightParams) {
      return `Great! I found your flight request:
• From: ${flightParams.from}
• To: ${flightParams.to}
• Departure: ${flightParams.departure ? flightParams.departure.toDateString() : 'Not specified'}
• Passengers: ${flightParams.passengers}
• Trip type: ${flightParams.tripType}

Let me search for flights for you now!`;
    }
    
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi')) {
      return "Hello! I'm here to help you find flights. Tell me where you'd like to travel from and to, and when you'd like to depart.";
    }
    
    if (message.includes('help')) {
      return "I can help you search for flights! Just tell me:\n• Where you're flying from\n• Where you're going\n• When you'd like to travel\n• How many passengers\n\nFor example: 'I want to fly from New York to Los Angeles on December 15th for 2 passengers'";
    }
    
    if (message.includes('price') || message.includes('cost')) {
      return "I'll help you find flights at different price points. Please tell me your departure and destination cities, and I'll show you various options with pricing.";
    }
    
    return "I'd be happy to help you find flights! Could you please provide more details about your trip? I need to know your departure city, destination, and travel dates to search for the best options.";
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
    setInput('');
    
    // Parse flight request
    const flightParams = parseFlightRequest(input);
    
    // Generate AI response
    const responseContent = generateResponse(input, flightParams);
    
    // Add assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        flightParams: flightParams || undefined
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Trigger flight search if we have valid parameters
      if (flightParams) {
        setTimeout(() => onFlightSearch(flightParams), 1000);
      }
      
      setIsLoading(false);
    }, 1000);
  };

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
            <div
              key={message.id}
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
            placeholder="Ask me about flights... e.g., 'I want to fly from NYC to LA next week'"
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
