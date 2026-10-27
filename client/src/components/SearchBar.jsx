import { useRef, useEffect } from 'react'
import { Search } from 'lucide-react'

export default function SearchBar({ placeholder = 'Search...', onSearch, value = '', className = '' }) {
  const debounceRef = useRef(null)

  const handleChange = (e) => {
    const val = e.target.value
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onSearch(val)
    }, 350)
  }

  useEffect(() => {
    return () => clearTimeout(debounceRef.current)
  }, [])

  return (
    <div className={`search-bar ${className}`}>
      <Search size={16} className="search-icon" />
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={value}
        onChange={handleChange}
        aria-label={placeholder}
      />
    </div>
  )
}
