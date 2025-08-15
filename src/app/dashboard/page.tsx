// import Dashboard from '@/app/components/Dashboard';

// export default function HomePage() {
//   return <Dashboard />;
// }

// app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Database, Users, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Project } from '@/types';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const router = useRouter();

  // Load projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
 
    setCreating(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName.trim() }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create project');
      }
      
      const newProject: Project = await res.json();
      if (newProject?.id) {
        setProjects([newProject, ...projects]);
        setNewProjectName('');
        setShowProjectForm(false);
      }
    } catch (err) {
      console.error('Failed to create project:', err);
      alert(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const handleViewProject = (projectId: number) => {
    // Navigate to individual project page
    router.push(`/dashboard/projects/${projectId}`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage your projects and users across multiple Neon databases</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Projects</h2>

        {showProjectForm ? (
          <form onSubmit={createProject} className="flex items-center space-x-2">
            <input 
              type="text" 
              placeholder="Project Name" 
              value={newProjectName} 
              onChange={e => setNewProjectName(e.target.value)} 
              required 
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              disabled={creating} 
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowProjectForm(false)} 
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button 
            onClick={() => setShowProjectForm(true)} 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2"/>
            New Project
          </button>
        )}
      </div>

      {projects.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <Database className="w-8 h-8 text-blue-500 mr-3"/>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                    <p className="text-sm text-gray-500">ID: {project.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleViewProject(project.id)} 
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded" 
                  title="View Project"
                >
                  <Eye className="w-4 h-4"/>
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1"/>
                  Database ready
                </div>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Database className="w-12 h-12 text-gray-400 mx-auto mb-4"/>
          <p className="text-gray-500">No projects yet. Create your first project!</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;