import { useLocation, Link } from 'react-router-dom'
import { Home, Search, Users, MessageSquare, Briefcase } from 'lucide-react'

const BottomNav = () => {
  const location = useLocation()
  const currentPath = location.pathname
  const userId = localStorage.getItem('_id')

  const navItems = [
    { to: `/dashboard/${userId}`, icon: Home, label: 'Feed' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/communities', icon: Users, label: 'Community' },
    { to: '/chat', icon: MessageSquare, label: 'Messages' },
    { to: '/jobs', icon: Briefcase, label: 'Jobs' }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t lg:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isActive={currentPath === item.to}
          />
        ))}
      </div>
    </nav>
  )
}

const NavItem = ({ to, icon: Icon, label, isActive }) => (
  <Link to={to} className="flex flex-col items-center justify-center w-full">
    <Icon 
      className={`h-6 w-6 ${
        isActive ? 'bg-gradient-to-r from-red-500 to-indigo-500 p-1 rounded-full' : 'text-black-500'
      } transition-colors duration-200`}
    />
    <span
      className={`text-xs mt-1 ${
        isActive ? 'bg-gradient-to-r from-red-500 to-indigo-500 text-transparent bg-clip-text' : 'text-black-500'
      } transition-colors duration-200`}
    >
      {label}
    </span>
  </Link>
)

export default BottomNav