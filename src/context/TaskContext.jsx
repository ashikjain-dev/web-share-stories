import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { taskApi } from '../lib/axios';
import { useAuth } from './useAuth';

export const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [view, setView] = useState('all'); // 'all' or 'mine'
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const limit = 5;
    const { user } = useAuth();

    const fetchTasks = useCallback(async (viewToFetch, pageNumber = 1) => {
        setLoading(true);
        setError(null);
        try {
            const endpoint = viewToFetch === 'mine' ? '/show' : '/';
            const res = await taskApi.get(endpoint, {
                params: { page: pageNumber, limit }
            });

            const fetchedTasks = res.data.data || [];
            setTasks(fetchedTasks);
            setView(viewToFetch);
            setPage(pageNumber);

            // If we got exactly 'limit' items, there might be more
            setHasMore(fetchedTasks.length === limit);
        } catch (err) {
            setError(err.response?.status === 429 ? err.message : `Failed to fetch ${viewToFetch === 'mine' ? 'your' : 'all'} stories`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const refresh = useCallback(() => fetchTasks(view, 1), [view, fetchTasks]);

    const createTask = async (storyData) => {
        setLoading(true);
        try {
            const res = await taskApi.post('/create', storyData);
            if (res.status === 201) {
                await fetchTasks(view, 1);
                return { success: true };
            }
            return { success: false, error: 'Failed to create story' };
        } catch (err) {
            console.error(err);
            return { success: false, error: err.response?.status === 429 ? err.message : (err.response?.data?.data || 'Failed to create story') };
        } finally {
            setLoading(false);
        }
    };

    const deleteStory = async (taskId) => {
        setLoading(true);
        try {
            const res = await taskApi.delete(`/${taskId}`);
            if (res.status === 200) {
                await fetchTasks(view, page);
                return { success: true };
            }
            return { success: false, error: 'Failed to delete story' };
        } catch (err) {
            console.error(err);
            return { success: false, error: err.response?.status === 429 ? err.message : (err.response?.data?.data || 'Failed to delete story') };
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1) {
            fetchTasks(view, newPage);
        }
    };

    // Handle initial view on login/logout or page load
    useEffect(() => {
        if (user) {
            fetchTasks('mine', 1);
        } else {
            fetchTasks('all', 1);
        }
    }, [!!user, fetchTasks]);

    return (
        <TaskContext.Provider value={{
            tasks, loading, error, view, setView,
            page, hasMore,
            refresh, fetchTasks, handlePageChange,
            createTask, deleteStory
        }}>
            {children}
        </TaskContext.Provider>
    );
}
