import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { logOut } from '../lib/Auth';
import { useAuth } from '../context/AuthContext';
import { CgProfile } from 'react-icons/cg';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { isLogin, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    }, [isMenuOpen]);

    useEffect(() => setIsMenuOpen(false), [location]);

    const handleLogout = async () => {
        await logOut();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Classes', path: '/classes' },
        { name: 'Teachers', path: '/teachers' },
        { name: 'Students', path: '/students' },
        { name: 'Exams', path: '/exams' },
        { name: 'Results', path: '/results' },
    ];

    return (
        // fixed top-0 left-0 right-0 z-50
        <nav className={` transition-all duration-300 ${
            isScrolled ? 'bg-white/80 shadow-lg backdrop-blur-md py-2' : 'bg-white py-4'
        }`}>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between'>
                    
                    {/* Logo */}
                    <Link to='/' className='flex items-center gap-2 group z-[60]'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white shadow-lg'>
                            <span className='text-xl font-black'>E</span>
                        </div>
                        <span className='text-2xl font-black tracking-tighter text-gray-900'>
                            EMS<span className='text-green-600'>.</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    {isLogin && (
                        <div className='hidden lg:flex items-center gap-1'>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                                        location.pathname === link.path
                                            ? 'bg-green-50 text-green-600'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Desktop Auth */}
                    <div className='hidden lg:flex items-center gap-4'>
                        {!isLogin ? (
                            <Link to='/login' className='rounded-xl bg-green-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-green-700'>
                                Sign In
                            </Link>
                        ) : (
                            <div className='flex items-center gap-3 pl-4 border-l border-gray-100'>
                                <button onClick={handleLogout} className='text-xs font-black uppercase text-gray-400 hover:text-red-500'>
                                    Logout
                                </button>
                                <Link to='/profile' className='flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 ring-2 ring-white'>
                                    <CgProfile size={24} />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <div className='flex lg:hidden z-[60]'>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className='rounded-lg p-2 text-gray-600 hover:bg-gray-100'
                        >
                            {isMenuOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* 📱 Corrected Mobile Menu Drawer */}
            <div className={`fixed inset-0 z-50 bg-white transition-all duration-300 ease-in-out lg:hidden ${
                isMenuOpen 
                    ? 'opacity-100 translate-y-0 pointer-events-auto' 
                    : 'opacity-0 -translate-y-full pointer-events-none'
            }`}>
                <div className='flex h-full flex-col p-6 pt-28 overflow-y-auto'>
                    {isLogin && (
                        <div className='space-y-2'>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block rounded-xl px-4 py-4 text-lg font-bold transition-all ${
                                        location.pathname === link.path
                                            ? 'bg-green-600 text-white'
                                            : 'text-gray-600 hover:bg-green-50'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className='mt-auto space-y-4 border-t border-gray-100 pt-6'>
                        {!isLogin ? (
                            <Link to='/login' className='flex w-full items-center justify-center rounded-xl bg-green-600 py-4 text-lg font-bold text-white'>
                                Login to Account
                            </Link>
                        ) : (
                            <div className='flex items-center justify-between rounded-2xl bg-gray-50 p-4'>
                                <div className='flex items-center gap-3'>
                                    <div className='h-12 w-12 rounded-full bg-green-600 flex items-center justify-center text-white'>
                                        <CgProfile size={28} />
                                    </div>
                                    <div>
                                        <p className='text-sm font-bold text-gray-900'>{user?.email?.split('@')[0]}</p>
                                        <button onClick={handleLogout} className='text-xs font-bold text-red-500 uppercase'>Sign Out</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;