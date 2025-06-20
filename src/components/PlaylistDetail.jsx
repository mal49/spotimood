import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { usePlaylist } from '../context/PlaylistContext';

export default function PlaylistDetail() {
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const { setQueue, setCurrentIndex, setPlaying } = usePlayer();
    const { 
        currentPlaylist, 
        isLoading, 
        error, 
        fetchPlaylistById, 
        updatePlaylist, 
        deletePlaylist 
    } = usePlaylist();
    
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');

    useEffect(() => {
        fetchPlaylistById(playlistId);
    }, [playlistId, fetchPlaylistById]);

    useEffect(() => {
        if (currentPlaylist) {
            setEditedTitle(currentPlaylist.title);
            setEditedDescription(currentPlaylist.description);
        }
    }, [currentPlaylist]);

    const handleUpdatePlaylist = async () => {
        const result = await updatePlaylist(playlistId, {
            title: editedTitle,
            description: editedDescription,
        });

        if (result) {
            setIsEditing(false);
        }
    };

    const handleDeletePlaylist = async () => {
        if (window.confirm('Are you sure you want to delete this playlist?')) {
            const result = await deletePlaylist(playlistId);
            if (result) {
                navigate('/playlists');
            }
        }
    };

    const handlePlayAll = () => {
        if (!currentPlaylist?.songs?.length) return;
        
        setQueue(currentPlaylist.songs);
        setCurrentIndex(0);
        setPlaying(true);
    };

    const handlePlaySong = (song, index) => {
        setQueue(currentPlaylist.songs.slice(index));
        setCurrentIndex(0);
        setPlaying(true);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-purple"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                Error: {error}
            </div>
        );
    }

    if (!currentPlaylist) {
        return (
            <div className="text-center text-gray-400 p-4">
                Playlist not found
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate('/playlists')}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    ← Back to Playlists
                </button>
            </div>

            {isEditing ? (
                <div className="mb-8">
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="w-full bg-dark-card text-white text-2xl font-bold mb-4 p-2 rounded"
                    />
                    <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full bg-dark-card text-gray-400 p-2 rounded"
                        rows="3"
                    />
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-gray-300 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdatePlaylist}
                            className="bg-primary-purple text-black px-4 py-2 rounded hover:bg-opacity-90"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-2">{currentPlaylist.title}</h1>
                            <p className="text-gray-400">{currentPlaylist.description}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-gray-400 hover:text-white"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button
                                onClick={handleDeletePlaylist}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center space-x-4 mb-8">
                <button 
                    onClick={handlePlayAll}
                    className="bg-primary-purple text-black px-6 py-3 rounded-full font-bold text-lg flex items-center space-x-2 hover:scale-105 transition-transform"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                    </svg>
                    <span>Play All</span>
                </button>
                <button className='bg-primary-purple text-black px-6 py-3 rounded-full font-bold text-lg flex items-center space-x-2 hover:scale-105 transition-colors'>
                    <span className='text-xl'>🔀</span>
                    <span>Shuffle</span>
                </button>
            </div>

            <div className='bg-dark-card rounded-lg p-4'>
                <div className='grid grid-cols-[auto,3fr,2fr,2fr,1fr] gap-4 text-text-medium text-sm font-semibold border-b border-dark-hover pb-2 mb-2'>
                    <div>#</div>
                    <div>TITLE</div>
                    <div>ARTIST</div>
                    <div>ALBUM</div>
                    <div className='text-right'>DURATION</div>
                </div>
                {playlist.songs?.map((song, index) => (
                    <div
                        key={song.id}
                        onClick={() => handlePlaySong(song, index)}
                        className="flex items-center p-4 hover:bg-dark-hover transition-colors cursor-pointer"
                    >
                        <div className="w-12 h-12 mr-4">
                            <img
                                src={song.thumbnail}
                                alt={song.title}
                                className="w-full h-full object-cover rounded"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-medium">{song.title}</h3>
                            <p className="text-gray-400 text-sm">{song.artist}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 