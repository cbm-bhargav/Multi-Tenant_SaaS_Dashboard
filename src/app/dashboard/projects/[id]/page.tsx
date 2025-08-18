// app/dashboard/projects/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, ArrowLeft, Database, Edit2, Trash2, Save, X } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import type { Project, User, CreateUserRequest } from '@/types';

const ProjectDetailPage: React.FC = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUser, setNewUser] = useState<CreateUserRequest>({ name: '', email: '' });
  const [addingUser, setAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [updatingUser, setUpdatingUser] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;

  // Fetch project and users on mount
  useEffect(() => {
    if (projectId && !isNaN(Number(projectId))) {
      fetchProject(projectId);
      fetchUsers(projectId);
    } else {
      // Invalid project ID, redirect to dashboard
      router.push('/dashboard');
    }
  }, [projectId]);

  const fetchProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
      } else {
        const errorData = await res.json();
        console.error('Failed to fetch project:', errorData.error);
        // Redirect to projects list if project not found
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Failed to fetch project:', err);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}/users`);
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch users');
        setUsers([]);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setUsers([]);
    }
  };

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !newUser.name.trim() || !newUser.email.trim()) return;

    setAddingUser(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUser.name.trim(),
          email: newUser.email.trim()
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create user');
      }
      
      const user: User = await res.json();
      if (user?.id) {
        setUsers([user, ...users]);
        setNewUser({ name: '', email: '' });
        setShowUserForm(false);
      }
    } catch (err) {
      console.error('Failed to create user:', err);
      alert(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setAddingUser(false);
    }
  };

  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !projectId) return;

    setUpdatingUser(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/users`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingUser.id,
          name: editingUser.name.trim(),
          email: editingUser.email.trim()
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update user');
      }

      const updatedUser: User = await res.json();
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      setEditingUser(null);
    } catch (err) {
      console.error('Failed to update user:', err);
      alert(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setUpdatingUser(false);
    }
  };

  const deleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`/api/projects/${projectId}/users?userId=${userId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const startEditingUser = (user: User) => {
    setEditingUser({ ...user });
  };

  const cancelEditingUser = () => {
    setEditingUser(null);
  };

  const handleBackToProjects = () => {
    router.push('/dashboard');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!project) return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
        <button 
          onClick={handleBackToProjects}
          className="text-blue-500 hover:text-blue-700"
        >
          Back to Projects
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={handleBackToProjects}
          className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </button>
        <div className="flex items-center mb-2">
          <Database className="w-8 h-8 text-blue-500 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600">Project ID: {project.id}</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Created: {new Date(project.createdAt).toLocaleDateString()}
        </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Name" 
                value={newUser.name} 
                onChange={e => setNewUser({...newUser, name: e.target.value})} 
                required 
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={newUser.email} 
                onChange={e => setNewUser({...newUser, email: e.target.value})} 
                required 
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-3 flex space-x-2">
              <button 
                type="submit"
                disabled={addingUser}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {addingUser ? 'Adding...' : 'Add User'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowUserForm(false)} 
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {users.length ? users.map(user => (
            <div key={user.id} className="p-4 bg-gray-50 rounded-lg">
              {editingUser?.id === user.id ? (
                <form onSubmit={updateUser} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={updatingUser}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50 text-sm flex items-center"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      {updatingUser ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditingUser}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm flex items-center"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                    <button
                      onClick={() => startEditingUser(user)}
                      className="p-1 text-yellow-500 hover:bg-yellow-50 rounded"
                      title="Edit User"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                      title="Delete User"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              No users yet. Add your first user!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;