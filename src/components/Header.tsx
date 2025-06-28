
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold text-blue-600">
              Google Travel
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-4">
                Flights
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 pb-4">
                Hotels
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 pb-4">
                Vacation rentals
              </a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
