import { useState } from 'react';
import { X, Plus, Clock, Tag, Loader2, Send } from 'lucide-react';
import { useTasks } from '../context/useTasks';

export default function StoryModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const { createTask } = useTasks();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const payload = {
            title: formData.title,
            description: formData.description,
            tags: formData.tags
        };

        const res = await createTask(payload);

        if (res.success) {
            setFormData({ title: '', description: '', tags: '' });
            onClose();
        } else {
            setError(res.error);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Plus className="w-5 h-5 text-blue-400" />
                            Share a New Story
                        </h2>
                        <p className="text-slate-400 text-sm">Inspire the community with your experiences</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Title</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. My first deployment to the cloud"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">The Story</label>
                        <textarea
                            required
                            rows={4}
                            placeholder="Tell your story here..."
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            Tags (space separated)
                        </label>
                        <input
                            type="text"
                            placeholder="coding life success"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Post Story
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
