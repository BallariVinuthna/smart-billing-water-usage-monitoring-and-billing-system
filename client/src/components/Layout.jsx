import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children, role }) => {
    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar role={role} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
