// import BottomNav from '@/components/BottomNav'
// import React from 'react'

// export default function() {
//   return (
//     <>
//     <div className='bg-blue-600 min-w-full'>
//       <input className='' type="text" />
//     </div>
//     <div>
//       {/* <BottomNav/> */}
//     </div>
//     </>
//   )
// }
import React, { useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import BottomNav from '@/components/BottomNav'

const Search = () => {
  const [query, setQuery] = useState('') // To track the input value
  const [results, setResults] = useState([]) // Store search results

  const handleSearch = (e) => {
    e.preventDefault()
    // Perform search logic here, for now, just a placeholder
    console.log(`Searching for: ${query}`)
    // You would replace the below example with actual search results
    setResults([
      { id: 1, name: 'Engineer Group 1' },
      { id: 2, name: 'Engineer Group 2' },
      { id: 3, name: 'Engineer Group 3' }
    ])
  }

  return (
    <div className="flex flex-col min-h-screen pb-16"> {/* Ensure page height is tall enough for BottomNav */}
      <header className="p-4 border-b bg-white">
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search communities, jobs..."
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="p-2 bg-red-500 text-white rounded">
            <SearchIcon className="h-5 w-5" />
          </button>
        </form>
      </header>

      <main className="flex-grow p-4">
        <h2 className="text-xl font-semibold mb-4">Search Results</h2>
        {results.length > 0 ? (
          <ul className="space-y-4">
            {results.map((result) => (
              <li
                key={result.id}
                className="p-4 border rounded hover:bg-gray-100 transition"
              >
                {result.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found.</p>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

export default Search
