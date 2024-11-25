import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './Layout.css';

function Layout({ children }) {
    return (
        <div className="layout">
            <Header />
            <div className="content">
                <Sidebar />
                <main className="main">
                    {children}
                </main>
            </div>
            {/*<Footer />*/}
        </div>
    );
}

export default Layout;