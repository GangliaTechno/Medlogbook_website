import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SuperAdminDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        activeStudents: 0,
        activeDoctors: 0,
        activeAdmins: 0,
    });
    const [loading, setLoading] = useState(true);
    const [expandedRole, setExpandedRole] = useState(null);
    const [roleDetails, setRoleDetails] = useState([]);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";

    useEffect(() => {
        if (!user || user.role !== "superadmin") {
            navigate("/", { replace: true });
            return;
        }

        const fetchStats = async () => {
            try {
                const response = await fetch(`${API_URL}/superadmin/stats`);
                if (!response.ok) throw new Error("Failed to fetch stats");
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user, navigate, API_URL]);

    const handleCardClick = async (role) => {
        if (expandedRole === role) {
            setExpandedRole(null);
            return;
        }

        setSearchQuery("");
        setExpandedRole(role);
        setDetailsLoading(true);
        try {
            const response = await fetch(`${API_URL}/superadmin/users/${role}`);
            if (!response.ok) throw new Error("Failed to fetch user details");
            const data = await response.json();
            setRoleDetails(data);
        } catch (error) {
            console.error(`Error fetching details for ${role}:`, error);
            setRoleDetails([]);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <div className="text-xl font-bold text-blue-800">Hospital Intelligence Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-x-hidden bg-[#f8fafc]">
            {/* Custom Image Background */}
            <div
                className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/superadmin-bg.png')" }}
            >
                {/* Subtle overlay to ensure readability */}
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-none">
                            Super Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dashboard</span>
                        </h1>
                        <p className="text-gray-500 mt-2 text-base font-medium flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Medical Platform Analytics Center
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="group relative inline-flex items-center px-6 py-2.5 overflow-hidden font-bold text-white transition-all bg-red-500 rounded-xl hover:bg-red-600 active:scale-95 shadow-lg"
                    >
                        <span className="relative text-sm">Logout System</span>
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">
                    {/* Active Students Card */}
                    <div
                        onClick={() => handleCardClick('student')}
                        className={`group cursor-pointer relative bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl p-6 transition-all duration-500 hover:shadow-blue-200/50 hover:-translate-y-1 border-2 ${expandedRole === 'student' ? 'border-blue-500 ring-4 ring-blue-50' : 'border-white'}`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                </svg>
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-100/50 py-1 px-3 rounded-full">Database Sync</div>
                        </div>
                        <h3 className="text-gray-600 font-bold text-base">Active Students</h3>
                        <div className="flex items-baseline mt-1">
                            <p className="text-4xl font-black text-gray-900 tracking-tighter">{stats.activeStudents}</p>
                            <span className="ml-2 text-blue-600 font-bold text-xs">Residency</span>
                        </div>
                        <div className="mt-4 flex items-center text-blue-600 font-bold text-xs">
                            View Details
                            <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </div>
                    </div>

                    {/* Active Doctors Card */}
                    <div
                        onClick={() => handleCardClick('doctor')}
                        className={`group cursor-pointer relative bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl p-6 transition-all duration-500 hover:shadow-purple-200/50 hover:-translate-y-1 border-2 ${expandedRole === 'doctor' ? 'border-purple-500 ring-4 ring-purple-50' : 'border-white'}`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-purple-500 bg-purple-100/50 py-1 px-3 rounded-full">Consultants</div>
                        </div>
                        <h3 className="text-gray-600 font-bold text-base">Active Doctors</h3>
                        <div className="flex items-baseline mt-1">
                            <p className="text-4xl font-black text-gray-900 tracking-tighter">{stats.activeDoctors}</p>
                            <span className="ml-2 text-purple-600 font-bold text-xs">Specialists</span>
                        </div>
                        <div className="mt-4 flex items-center text-purple-600 font-bold text-xs">
                            View Details
                            <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </div>
                    </div>

                    {/* Active Admins Card */}
                    <div
                        onClick={() => handleCardClick('admin')}
                        className={`group cursor-pointer relative bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl p-6 transition-all duration-500 hover:shadow-green-200/50 hover:-translate-y-1 border-2 ${expandedRole === 'admin' ? 'border-green-500 ring-4 ring-green-50' : 'border-white'}`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-100/50 py-1 px-3 rounded-full">Security</div>
                        </div>
                        <h3 className="text-gray-600 font-bold text-base">Active Admins</h3>
                        <div className="flex items-baseline mt-1">
                            <p className="text-4xl font-black text-gray-900 tracking-tighter">{stats.activeAdmins}</p>
                            <span className="ml-2 text-green-600 font-bold text-xs">Total Power</span>
                        </div>
                        <div className="mt-4 flex items-center text-green-600 font-bold text-xs">
                            View Details
                            <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </div>
                    </div>
                </div>

                {/* Detailed User List Section - Dynamic */}
                {expandedRole && (
                    <div className="mt-6 animate-in slide-in-from-top duration-500">
                        <div className="bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-xl overflow-hidden border border-white">
                            <div className="p-6 sm:p-10">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-100">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">
                                            Inventory: <span className="text-blue-600">{expandedRole}s</span>
                                        </h2>
                                        <p className="text-gray-500 text-sm font-medium">Verifying and auditing all active entries</p>
                                    </div>
                                    <button
                                        onClick={() => setExpandedRole(null)}
                                        className="mt-4 sm:mt-0 text-gray-400 hover:text-gray-900 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>

                                {/* Search Bar Feature */}
                                <div className="mb-8 relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={`Search ${expandedRole} by name or email...`}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                                    />
                                </div>

                                {detailsLoading ? (
                                    <div className="py-12 flex flex-col items-center">
                                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="mt-4 text-blue-800 text-sm font-bold animate-pulse">Syncing Encrypted Data...</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto custom-scrollbar">
                                        <table className="w-full text-left border-separate border-spacing-y-2">
                                            <thead>
                                                <tr className="text-gray-400 font-bold text-[9px] uppercase tracking-widest px-4">
                                                    <th className="pb-1 px-2 border-b border-gray-100">Full Name</th>
                                                    <th className="pb-1 px-2 border-b border-gray-100">Email</th>
                                                    <th className="pb-1 px-2 border-b border-gray-100">Hospital</th>
                                                    <th className="pb-1 px-2 border-b border-gray-100">Specialty</th>
                                                    <th className="pb-1 px-2 border-b border-gray-100">Year</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-[12px]">
                                                {roleDetails && roleDetails.filter(item =>
                                                    item.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    item.email?.toLowerCase().includes(searchQuery.toLowerCase())
                                                ).length > 0 ? (
                                                    roleDetails
                                                        .filter(item =>
                                                            item.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                            item.email?.toLowerCase().includes(searchQuery.toLowerCase())
                                                        )
                                                        .map((item, idx) => (
                                                            <tr key={idx} className="group/row bg-gray-50/50 hover:bg-blue-50 transition-all duration-300 rounded-xl">
                                                                <td className="py-3 px-3 first:rounded-l-xl border-t border-gray-100 sm:border-t-0">
                                                                    <div className="flex items-center">
                                                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[9px] ring-2 ring-white shadow-sm mr-3">
                                                                            {item.fullName?.substring(0, 1) || 'U'}
                                                                        </div>
                                                                        <span className="font-bold text-gray-800">{item.fullName}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-3 border-t border-gray-100 sm:border-t-0">
                                                                    <span className="text-gray-600 text-[11px]">{item.email}</span>
                                                                </td>
                                                                <td className="py-3 px-3 border-t border-gray-100 sm:border-t-0">
                                                                    <div className="inline-flex items-center text-indigo-700 font-bold text-[9px] px-2 py-0.5 bg-indigo-50 rounded-md">
                                                                        {item.hospital || 'N/A'}
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-3 border-t border-gray-100 sm:border-t-0">
                                                                    <span className="text-gray-700 font-bold text-[11px]">{item.specialty || 'General'}</span>
                                                                </td>
                                                                <td className="py-3 px-3 last:rounded-r-xl border-t border-gray-100 sm:border-t-0">
                                                                    <span className="bg-gray-200/50 text-gray-700 font-black text-[9px] px-2 py-0.5 rounded-md">
                                                                        {item.trainingYear || 'N/A'}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="py-12 text-center text-gray-400 font-bold italic text-xs">No results found for "{searchQuery}" in the database cluster.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Footer */}
                <div className="mt-12 bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[3rem] p-10 sm:p-14 text-white shadow-[0_30px_60px_-15px_rgba(59,130,246,0.3)] relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 text-center md:text-left">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-black mb-3 italic tracking-tighter uppercase">Platform Integrity</h2>
                            <p className="text-blue-100/80 text-lg font-medium max-w-xl">All modules are operating within normal parameters. Data feeds are encrypted and verified against the master ledger.</p>
                        </div>
                        <div className="flex space-x-4">
                            <div className="text-center px-8 py-4 bg-white/10 backdrop-blur-md rounded-3xl">
                                <p className="text-3xl font-black tracking-tighter">100%</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Uptime</p>
                            </div>
                            <div className="text-center px-8 py-4 bg-white/10 backdrop-blur-md rounded-3xl">
                                <p className="text-3xl font-black tracking-tighter">SECURE</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Auth</p>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
                </div>
            </div>

            {/* Global Smooth Scroller Styling */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { height: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}} />
        </div>
    );
};

export default SuperAdminDashboard;
