import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './Layout.css';

function Layout() {
    const [activeContent, setActiveContent] = useState(null);
    return (
        <div className="layout">
            <Header />
            <div className="content">
                <Sidebar setActiveContent={setActiveContent} />
                    {activeContent && <main className="main">{activeContent}</main>}
            </div>
            {/*<Footer />*/}
        </div>
    );
}

export default Layout;