import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useTasks } from '../context/useTasks';
import { useTheme } from '../context/useTheme';
import { LogOut, Layout, Plus, Circle, RefreshCcw, Loader2, LogIn, UserPlus, BookOpen, PenLine, Trash2, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import StoryModal from '../components/StoryModal';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const { tasks, loading, error, view, fetchTasks, refresh, deleteStory, page, hasMore, handlePageChange } = useTasks();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const handleLogoClick = (e) => {
        e.preventDefault();
        fetchTasks('all');
    };

    const handleManageClick = () => {
        fetchTasks('mine');
    };

    const handleDelete = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
            setDeletingId(taskId);
            const res = await deleteStory(taskId);
            if (!res.success) {
                alert(res.error);
            }
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-sans transition-colors duration-300">
            {/* Navigation */}
            <nav className="bg-white/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 backdrop-blur-md transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo - Clicks to see All Stories */}
                        <button
                            onClick={handleLogoClick}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            <BookOpen className="w-6 h-6 text-blue-400 shrink-0" />
                            <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent italic hidden min-[400px]:inline">
                                ShareStories
                            </span>
                        </button>

                        {/* Top Right Actions */}
                        <div className="flex items-center gap-3 sm:gap-4">
                            {user ? (
                                <>
                                    <button
                                        onClick={toggleTheme}
                                        className="p-2 text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50"
                                        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                    >
                                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                    </button>

                                    <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700"></div>

                                    <button
                                        onClick={handleManageClick}
                                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${view === 'mine' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
                                    >
                                        <span>Manage<span className="hidden sm:inline"> your stories</span></span>
                                    </button>
                                    <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700"></div>
                                    <span className="text-slate-500 dark:text-slate-300 text-sm hidden lg:inline">
                                        Hello, <span className="text-slate-900 dark:text-white font-medium">{user.firstName}</span>
                                    </span>
                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors text-sm font-medium bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1.5 sm:px-3 rounded-lg border border-slate-200 dark:border-slate-600"
                                    >
                                        <LogOut className="w-4 h-4 shrink-0" />
                                        <span className="hidden xs:inline">Logout</span>
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <button
                                        onClick={toggleTheme}
                                        className="p-2 text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 mr-2"
                                        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                    >
                                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                    </button>

                                    <Link
                                        to="/login"
                                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors text-sm font-medium px-2 py-2 sm:px-4"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        <span className="hidden sm:inline">Sign In</span>
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white transition-all text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-lg shadow-blue-500/10"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        <span>Join<span className="hidden sm:inline"> Now</span></span>
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
                    <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-300 dark:to-white bg-clip-text text-transparent">
                        {view === 'mine' ? 'Your Stories' : 'Explore Stories'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                        {view === 'mine'
                            ? 'Manage and revisit the moments you have shared with the community.'
                            : 'Discover experiences, insights, and moments shared by our community in real-time.'}
                    </p>
                </div>

                {/* Story Feed Section */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 flex items-center gap-3">
                            {view === 'mine' ? 'My Contributions' : 'Latest Stories'}
                            {user && view === 'mine' && (
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="p-1 px-3 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-500/20 transition-all flex items-center gap-2"
                                >
                                    <PenLine className="w-3 h-3" />
                                    New Story
                                </button>
                            )}
                        </h2>
                        <button
                            onClick={refresh}
                            disabled={loading}
                            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
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
                            <p className="text-red-600 dark:text-red-400">{error}</p>
                            <button onClick={refresh} className="mt-2 text-blue-500 dark:text-blue-400 text-sm hover:underline">Retry Feed</button>
                        </div>
                    )}

                    {!loading && tasks.length === 0 && !error && (
                        <div className="p-20 bg-white dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-700 rounded-3xl text-center shadow-sm">
                            <p className="text-slate-400 dark:text-slate-500 text-lg mb-2">
                                {view === 'mine' ? 'You haven\'t shared anything yet.' : 'The floor is empty...'}
                            </p>
                            <button
                                onClick={() => user ? setIsCreateModalOpen(true) : navigate('/login')}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium text-sm flex items-center justify-center gap-2 mx-auto"
                            >
                                <Plus className="w-4 h-4" />
                                {view === 'mine' ? 'Create your first story' : 'Be the first to share!'}
                            </button>
                        </div>
                    )}

                    <div className="grid gap-6">
                        {tasks.map((task) => (
                            <div key={task._id} className="p-8 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-3xl hover:border-slate-400 dark:hover:border-slate-500 transition-all flex flex-col gap-4 group relative shadow-sm hover:shadow-md dark:shadow-none">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                                        <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {view === 'mine' && (
                                            <button
                                                onClick={() => handleDelete(task._id)}
                                                disabled={deletingId === task._id}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                title="Delete Story"
                                            >
                                                {deletingId === task._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-2xl mb-2 text-slate-800 dark:text-slate-100">{task.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{task.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {task.tags?.map(tag => (
                                            <span key={tag} className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg font-bold uppercase tracking-tighter">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {!loading && tasks.length > 0 && (
                        <div className="flex items-center justify-between pt-8 border-t border-slate-800 mt-8">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 text-sm font-medium transition-all ${page === 1
                                    ? 'text-slate-600 border-slate-800 cursor-not-allowed'
                                    : 'text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800'
                                    }`}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>

                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Page</span>
                                <span className="w-8 h-8 flex items-center justify-center bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-lg font-bold text-sm">
                                    {page}
                                </span>
                            </div>

                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={!hasMore}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 text-sm font-medium transition-all ${!hasMore
                                    ? 'text-slate-600 border-slate-800 cursor-not-allowed'
                                    : 'text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800'
                                    }`}
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal */}
            <StoryModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

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
