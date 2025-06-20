import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePlaylist } from '../../context/PlaylistContext.jsx';

export default function Sidebar() {
    const location = useLocation();
    const { playlists, fetchPlaylists } = usePlaylist();

    useEffect(() => {
        fetchPlaylists();
    }, [location.pathname, fetchPlaylists]); // Refetch when navigating

    const NavLink = ({ icon, text, to }) => (
        <Link 
            to={to}
            className={`flex items-center space-x-4 p-3 rounded-md w-full text-left transition-colors ${
                location.pathname === to ? 'text-text-light bg-dark-card' : 'text-text-medium hover:text-text-light hover:bg-dark-card'
            }`}
        >
            {icon}
            <span className='font-bold'>{text}</span>
        </Link>
    );


    
    return(
        <div className='w-64 bg-black p-4 flex flex-col space-y-4'>
            <nav className='space-y-2'>
                <NavLink icon={<span className='text-xl'>🏠</span>} text="Home" to="/" />
                <NavLink icon={<span className='text-xl'>🔍</span>} text="Search" to="/search" />
                <NavLink icon={<span className='text-xl'>📚</span>} text="Your Library" to="/library" />
                <NavLink icon={<span className='text-xl'>💎</span>} text="Premium" to="/subscription" />
            </nav>

            <div className='border-t border-dark-card pt-4 mt-4'>
                <NavLink icon={<span className='text-xl'>💬</span>} text="Feedback" to="/feedback" />
            </div>

            <div className='border-t border-dark-card pt-4 mt-4'>
                <h3 className='text-sm text-text-medium mb-2 uppercase tracking-wider'>Playlists</h3>
                <Link 
                    to="/playlists"
                    className='flex items-center space-x-2 text-text-medium hover:text-text-light p-3 rounded-md w-full text-left transition-colors'
                > 
                    <span className='text-xl'>+</span>
                    <span className='font-bold'>Create Playlist</span>
                </Link>

                <ul className='mt-2 space-y-1 text-sm text-text-medium overflow-y-auto max-h-48'>
                    {playlists.map((playlist) => (
                        <li key={playlist.id}>
                            <Link 
                                to={`/playlist/${playlist.id}`}
                                className='hover:text-text-light p-2 rounded-md w-full text-left transition-colors'
                            >
                                {playlist.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}