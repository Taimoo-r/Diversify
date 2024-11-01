import { BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-black">
        <nav className="flex flex-wrap justify-between items-center shadow-md px-2 sm:px-4 py-3">
          <motion.h1
            className="text-white text-2xl md:text-3xl font-bold flex flex-row items-center gap-2 order-1"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <BookOpen className="h-6 w-6 md:h-7 md:w-7" />
            Diversify
          </motion.h1>

          <div className="flex gap-2 md:gap-3 order-2 md:order-3 mt-3 md:mt-0 w-full md:w-auto">
            <Link to="/sign-up" className="flex-1 md:flex-auto">
              <motion.button
                className="bg-indigo-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded text-sm md:text-base w-full"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </Link>
            <Link to="/login" className="flex-1 md:flex-auto">
              <motion.button
                className="bg-indigo-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded text-sm md:text-base w-full"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
            </Link>
          </div>
        </nav>
      </div>
    </motion.div>
  )
}