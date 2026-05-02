import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Users, BarChart3, Plus } from 'lucide-react'

const Navigation: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="space-y-2">
      <Link
        to="/"
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
          isActive('/') 
            ? 'bg-neon-yellow text-black' 
            : 'text-gray-400 hover:text-white hover:bg-dark-border'
        }`}
      >
        <Home size={20} />
        <span className="font-medium">Home</span>
      </Link>

      <Link
        to="/clients"
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
          isActive('/clients') 
            ? 'bg-neon-yellow text-black' 
            : 'text-gray-400 hover:text-white hover:bg-dark-border'
        }`}
      >
        <Users size={20} />
        <span className="font-medium">Clients</span>
      </Link>

      <Link
        to="/analytics"
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
          isActive('/analytics') 
            ? 'bg-neon-yellow text-black' 
            : 'text-gray-400 hover:text-white hover:bg-dark-border'
        }`}
      >
        <BarChart3 size={20} />
        <span className="font-medium">Analytics</span>
      </Link>

      <div className="pt-4 border-t border-dark-border">
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-neon-yellow text-black font-medium hover:bg-yellow-300 transition-colors">
          <Plus size={20} />
          <span>New Assessment</span>
        </button>
      </div>
    </div>
  )
}

export default Navigation
