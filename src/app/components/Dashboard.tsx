// export default Dashboard;
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Database, Users, Eye, ArrowLeft } from 'lucide-react';
import type { Project, User, CreateUserRequest } from '@/types';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUser, setNewUser] = useState<CreateUserRequest>({ name: '', email: '' });
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  // Load projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Refetch users every time a project is selected
  useEffect(() => {
    if (selectedProject) fetchUsers(selectedProject.id.toString());
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/users`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setUsers([]);
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName) return;
 
    setCreating(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName }),
      });
      const newProject: Project = await res.json();
      if (newProject?.id) {
        setProjects([newProject, ...projects]);
        setNewProjectName('');
        setShowProjectForm(false);
      }
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      setCreating(false);
    }
  };

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !newUser.name || !newUser.email) return;

    try {
      const res = await fetch(`/api/projects/${selectedProject.id}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const user: User = await res.json();
      if (user?.id) {
        setUsers([user, ...users]);
        setNewUser({ name: '', email: '' });
        setShowUserForm(false);
      }
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>;

  // Selected Project View
  if (selectedProject) return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => setSelectedProject(null)}
          className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedProject.name}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Users</h2>
          <button
            onClick={() => setShowUserForm(!showUserForm)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>

        {showUserForm && (
          <form onSubmit={addUser} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Name" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"/>
              <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div className="mt-3 flex space-x-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Add User</button>
              <button type="button" onClick={() => setShowUserForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Cancel</button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {users.length ? users.map(user => (
            <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-800">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
              <div className="text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</div>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">No users yet. Add your first user!</div>
          )}
        </div>
      </div>
    </div>
  );

  // Dashboard view
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Multi-Tenant SaaS Dashboard</h1>
        <p className="text-gray-600">Manage your projects and users across multiple Neon databases</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Projects</h2>

        {showProjectForm ? (
          <form onSubmit={createProject} className="flex items-center space-x-2">
            <input type="text" placeholder="Project Name" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} required className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"/>
            <button type="submit" disabled={creating} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50">{creating ? 'Creating...' : 'Create'}</button>
            <button type="button" onClick={() => setShowProjectForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Cancel</button>
          </form>
        ) : (
          <button onClick={() => setShowProjectForm(true)} className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 flex items-center">
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
                  </div>
                </div>
                <button onClick={() => setSelectedProject(project)} className="p-2 text-blue-500 hover:bg-blue-50 rounded" title="View Project">
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
