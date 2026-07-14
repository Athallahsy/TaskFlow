import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat project.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (data) => {
    const res = await api.post('/projects', data);
    setProjects((prev) => [res.data, ...prev]);
    return res.data;
  };

  const updateProject = async (id, data) => {
    const res = await api.put(`/projects/${id}`, data);
    setProjects((prev) => prev.map((p) => (p.id === id ? res.data : p)));
    return res.data;
  };

  const deleteProject = async (id) => {
    await api.delete(`/projects/${id}`);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return { projects, loading, error, fetchProjects, createProject, updateProject, deleteProject };
};
