import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Events from './components/Events';
import AddEventForm from './components/AddEventForm';
import Users from './components/Users';
import Tickets from './components/Tickets';
import Settings from './components/Settings';
import Reports from './components/Reports';
import CategoryManagement from './components/CategoryManagement';

const Admin: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'events':
                return <Events setActiveTab={setActiveTab} />;
            case 'add-event':
                return <AddEventForm
                    onSubmit={(data, isEdit) => {
                        console.log('Submit:', data, isEdit);
                    }}
                    onClose={() => setActiveTab('events')}
                    onRedirectToEvents={() => setActiveTab('events')}
                />
            case 'categories':
                return <CategoryManagement setActiveTab={setActiveTab} />;
            case 'users':
                return <Users />;
            case 'tickets':
                return <Tickets />;
            case 'settings':
                return <Settings />;
            case `reports`:
                return <Reports />
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={sidebarOpen}
                onClose={closeSidebar}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-0">
                {/* Header */}
                <Header
                    activeTab={activeTab}
                    onMenuClick={toggleSidebar}
                />

                {/* Content Area */}
                <main className="flex-1">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default Admin;