import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const useTasks = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/projects/${projectId}/tasks`);
      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat task.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (data) => {
    const res = await api.post(`/projects/${projectId}/tasks`, data);
    setTasks((prev) => [res.data, ...prev]);
    return res.data;
  };

  const updateTask = async (id, data) => {
    const res = await api.put(`/tasks/${id}`, data);
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    return res.data;
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask };
};
