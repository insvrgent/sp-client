import React, { useEffect, useState } from 'react';
import SpotifyManager from './components/SpotifyManager';
import { connectSocket, getSocket } from './services/socketService';

const Modal = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modal}>
                <h2>{title}</h2>
                <p>{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

const styles = {
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        background: 'white',
        padding: '20px',
        borderRadius: '5px',
        textAlign: 'center',
    },
};

const App = () => {
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });

    useEffect(() => {
        const shopId = window.location.pathname.split('/')[1]; // Get shopId from the URL
        const userId = localStorage.getItem('userId');

        // Connect to Socket.IO
        if (userId) {
            connectSocket(shopId, userId);
        }

        const socket = getSocket();

        const openModal = (title, message) => {
            setModal({ isOpen: true, title, message });
        };

        // Socket event listeners
        if (socket) {
            socket.on('pleaseSelect', () => openModal('Select a Track', 'Please select a track to play.'));
            socket.on('pleasePlay', () => openModal('Play Track', 'Please play the selected track.'));
            socket.on('playSuccess', () => openModal('Success', 'The track is now playing.'));
        }

        // Cleanup on unmount
        return () => {
            if (socket) {
                socket.off('pleaseSelect');
                socket.off('pleasePlay');
                socket.off('playSuccess');
            }
        };
    }, []);

    const closeModal = () => {
        setModal({ ...modal, isOpen: false });
    };

    return (
        <div>
            <SpotifyManager />
            <Modal 
                isOpen={modal.isOpen} 
                onClose={closeModal} 
                title={modal.title} 
                message={modal.message} 
            />
        </div>
    );
};

export default App;
