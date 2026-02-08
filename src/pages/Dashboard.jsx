import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { LogOut, Layout, Plus, Circle, RefreshCcw, Loader2, LogIn, UserPlus, BookOpen, Settings } from 'lucide-react';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const { tasks, loading, error, view, fetchTasks, refresh } = useTasks();

    const handleLogoClick = (e) => {
        e.preventDefault();
        fetchTasks('all');
    };

    const handleManageClick = () => {
        fetchTasks('mine');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            {/* Navigation */}
            <nav className="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo - Clicks to see All Stories */}
                        <button
                            onClick={handleLogoClick}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            <BookOpen className="w-6 h-6 text-blue-400" />
                            <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent italic">
                                ShareStories
                            </span>
                        </button>

                        {/* Top Right Actions */}
                        <div className="flex items-center gap-4">
                            {user ? (
                                <>
                                    <button
                                        onClick={handleManageClick}
                                        className={`flex items-center gap-2 text-sm font-medium transition-colors hidden sm:flex ${view === 'mine' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        <Settings className="w-4 h-4" />
                                        Manage your stories
                                    </button>
                                    <div className="h-4 w-[1px] bg-slate-700 hidden sm:block"></div>
                                    <span className="text-slate-300 text-sm hidden md:inline">
                                        Hello, <span className="text-white font-medium">{user.firstName}</span>
                                    </span>
                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-600"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex gap-2">
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium px-4 py-2"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white transition-all text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-blue-500/10"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold mb-4">
                        {view === 'mine' ? 'Your Stories' : 'Explore Stories'}
                    </h1>
                    <p className="text-slate-400 max-w-lg mx-auto">
                        {view === 'mine'
                            ? 'Manage and revisit the moments you have shared with the community.'
                            : 'Discover experiences, insights, and moments shared by our community in real-time.'}
                    </p>
                </div>

                {/* Story Feed Section */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-200">
                            {view === 'mine' ? 'My Contributions' : 'Latest Stories'}
                        </h2>
                        <button
                            onClick={refresh}
                            disabled={loading}
                            className="p-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    {loading && tasks.length === 0 && (
                        <div className="flex justify-center p-20">
                            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                        </div>
                    )}

                    {error && (
                        <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
                            <p className="text-red-400">{error}</p>
                            <button onClick={refresh} className="mt-2 text-blue-400 text-sm hover:underline">Retry Feed</button>
                        </div>
                    )}

                    {!loading && tasks.length === 0 && !error && (
                        <div className="p-20 bg-slate-800/30 border border-dashed border-slate-700 rounded-3xl text-center">
                            <p className="text-slate-500 text-lg mb-2">
                                {view === 'mine' ? 'You haven\'t shared anything yet.' : 'The floor is empty...'}
                            </p>
                            <p className="text-slate-600 text-sm">
                                {view === 'mine' ? 'Ready to share your first story?' : 'Be the first to share a story!'}
                            </p>
                        </div>
                    )}

                    <div className="grid gap-6">
                        {tasks.map((task, index) => (
                            <div key={index} className="p-8 bg-slate-800/40 border border-slate-700 rounded-3xl hover:border-slate-500 transition-all flex flex-col gap-4 group">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                                        <BookOpen className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <span className="text-[11px] text-slate-500 font-medium uppercase tracking-widest bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700">
                                        {view === 'mine' ? 'Your Story' : 'Public Story'}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-2xl mb-2 text-slate-100">{task.title}</h3>
                                    <p className="text-slate-400 leading-relaxed mb-4">{task.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {task.tags?.map(tag => (
                                            <span key={tag} className="text-[10px] bg-slate-700 text-slate-300 px-3 py-1 rounded-lg font-bold uppercase tracking-tighter">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer / CTA if not logged in */}
            {!user && (
                <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 py-6 px-6 text-center text-white font-medium flex items-center justify-center gap-6 z-50 shadow-[0_-10px_40px_rgba(37,99,235,0.2)]">
                    <span className="text-lg">Have a story worth sharing?</span>
                    <Link to="/signup" className="bg-white text-blue-600 px-8 py-2 rounded-full text-sm font-extrabold hover:scale-105 transition-transform">
                        Start Sharing Now
                    </Link>
                </div>
            )}
        </div>
    );
}
