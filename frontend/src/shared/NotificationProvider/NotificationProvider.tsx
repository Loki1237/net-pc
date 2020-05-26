import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Styles.css';

const NotificationProvider = () => {
    return (
        <ToastContainer position="bottom-left" 
            autoClose={6000}
            newestOnTop={true}
            closeButton={false}
            draggable={false}
            className="NotificationProvider"
            toastClassName="Notification"
            progressClassName="Notification-progress"
        />
    );
}

export default NotificationProvider;
