import React from 'react';
import Header from './Header';

function Layout({ children }) {
    return (
        <div className="min-h-screen bg-[#4a919e] flex flex-col">
            <Header />
            <main className="flex-1 pt-16">
                {children}
            </main>
        </div>
    );
}

export default Layout; 