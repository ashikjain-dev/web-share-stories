import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { taskApi } from '../lib/axios';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const fetchPublicStories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Calling taskApi.get('') with baseURL ending in / resulting in https://sharestories.in/api/v1/tasks/
            const res = await taskApi.get('');
            setTasks(res.data.data || []);
        } catch (err) {
            setError('Failed to fetch public stories');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPublicStories();
    }, [fetchPublicStories]);

    return (
        <TaskContext.Provider value={{ tasks, loading, error, refresh: fetchPublicStories }}>
            {children}
        </TaskContext.Provider>
    );
}

export const useTasks = () => useContext(TaskContext);
