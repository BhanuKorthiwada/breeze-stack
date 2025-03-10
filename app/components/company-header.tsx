import { Link } from "react-router"

export const CompanyHeader = () => {
    return (
        <header className="bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/75 sticky top-0 z-50 border-b border-gray-200/70 shadow-sm">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="font-bold text-2xl">
                    <Link to="/" className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                        Breeze Stack
                    </Link>
                </div>
                <div className="hidden md:flex space-x-8">
                    <Link to="/privacy-policy" className="text-gray-700 hover:text-blue-600 transition-colors relative after:absolute after:bottom-0 after:start-0 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all hover:after:w-full">
                        Privacy Policy
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        to="/account/login"
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow ring-offset-2 hover:ring-2 ring-blue-400/30"
                    >
                        Login
                    </Link>
                    <button className="md:hidden text-gray-700 hover:text-blue-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
            </nav>
        </header>
    )
}
