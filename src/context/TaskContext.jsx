import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { taskApi } from '../lib/axios';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [view, setView] = useState('all'); // 'all' or 'mine'
    const { user } = useAuth();

    const fetchTasks = useCallback(async (viewToFetch = view) => {
        setLoading(true);
        setError(null);
        try {
            const endpoint = viewToFetch === 'mine' ? '/show' : '/';
            const res = await taskApi.get(endpoint);
            setTasks(res.data.data || []);
            setView(viewToFetch);
        } catch (err) {
            setError(`Failed to fetch ${viewToFetch === 'mine' ? 'your' : 'all'} stories`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [view]);

    // Handle default view on login/logout
    useEffect(() => {
        if (user) {
            fetchTasks('mine');
        } else {
            fetchTasks('all');
        }
    }, [user]);

    return (
        <TaskContext.Provider value={{ tasks, loading, error, view, setView, refresh: () => fetchTasks(view), fetchTasks }}>
            {children}
        </TaskContext.Provider>
    );
}

export const useTasks = () => useContext(TaskContext);
