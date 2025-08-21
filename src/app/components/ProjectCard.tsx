// components/ProjectCard.tsx
// 'use client';

// import React, { useState, useTransition } from 'react';
// import { Database, Users, Eye, Trash2, Edit2, Check, X } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { updateProject, deleteProject } from '@/app/actions/project-actions';
// import type { Project } from '@/types';
// import ClientDate from './ClientDate';

// interface ProjectCardProps {
//   project: Project;
// }

// const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editName, setEditName] = useState(project.name);
//   const [error, setError] = useState<string | null>(null);
//   const [isPending, startTransition] = useTransition();
//   const router = useRouter();

//   const handleView = () => {
//     router.push(`/dashboard/projects/${project.id}`);
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//     setEditName(project.name);
//     setError(null);
//   };

//   const handleSaveEdit = () => {
//     if (!editName.trim()) {
//       setError('Project name is required');
//       return;
//     }

//     setError(null);

//     startTransition(async () => {
//       try {
//         await updateProject(project.id, { name: editName.trim() });
//         setIsEditing(false);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to update project');
//       }
//     });
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     setEditName(project.name);
//     setError(null);
//   };

//   const handleDelete = () => {
//     if (!confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
//       return;
//     }

//     startTransition(async () => {
//       try {
//         await deleteProject(project.id);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to delete project');
//       }
//     });
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//       <div className="flex items-start justify-between">
//         <div className="flex items-center flex-1">
//           {/* <Database className="w-8 h-8 text-blue-500 mr-3 flex-shrink-0" /> */}
//           <div className="flex-1">
//             {isEditing ? (
//               <div className="flex flex-row gap-x-1">
//                 <input
//                   type="text"
//                   value={editName}
//                   onChange={(e) => setEditName(e.target.value)}
//                   className="text-lg font-semibold text-gray-800 border rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                   disabled={isPending}
//                   autoFocus
//                 />
//                 <button
//                   onClick={handleSaveEdit}
//                   disabled={isPending || !editName.trim()}
//                   className="p-1 text-green-600 hover:bg-green-50 hover:cursor-pointer rounded disabled:opacity-50"
//                   title="Save changes"
//                 >
//                   <Check className="w-6 h-6 text-xl font-extrabold" />
//                 </button>
//                 <button
//                   onClick={handleCancelEdit}
//                   disabled={isPending}
//                   className="p-1 text-gray-600 hover:bg-gray-50 hover:cursor-pointer rounded disabled:opacity-50"
//                   title="Cancel editing"
//                 >
//                   <X className="w-6 h-6 text-xl font-extrabold" />
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
//                 <p className="text-sm text-gray-500">ID: {project.id}</p>
//               </>
//             )}
//           </div>
//         </div>

//         {!isEditing && (
//           <div className="flex space-x-1 ml-2">
//             <button
//               onClick={handleView}
//               className="p-2 text-blue-500 hover:bg-blue-50 hover:cursor-pointer rounded transition-colors"
//               title="View Project"
//             >
//               <Eye className="w-5 h-5" />
//             </button>
//             <button
//               onClick={handleEdit}
//               disabled={isPending}
//               className="p-2 text-gray-500 hover:bg-gray-50 hover:cursor-pointer rounded transition-colors disabled:opacity-50"
//               title="Edit Project"
//             >
//               <Edit2 className="w-5 h-5" />
//             </button>
//             <button
//               onClick={handleDelete}
//               disabled={isPending}
//               className="p-2 text-red-500 hover:bg-red-50 hover:cursor-pointer rounded transition-colors disabled:opacity-50"
//               title="Delete Project"
//             >
//               <Trash2 className="w-5 h-5" />
//             </button>
//           </div>
//         )}
//       </div>

//       {error && (
//         <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
//           {error}
//         </div>
//       )}

//       <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
//         <div className="flex items-center">
//           <Users className="w-4 h-4 mr-1" />
//           Database ready
//         </div>
//         <ClientDate date={project.createdAt} className="text-sm text-gray-500" />
//       </div>

//       {isPending && (
//         <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
//           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectCard;

// components/ProjectCard.tsx
"use client";

import React, { useState, useTransition } from "react";
import { Eye, Edit2, Trash2, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateProject, deleteProject } from "@/app/actions/project-actions";
import type { Project } from "@/types";
import ClientDate from "./ClientDate";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleView = () => router.push(`/dashboard/projects/${project.id}`);
  const handleEdit = () => {
    setIsEditing(true);
    setEditName(project.name);
  };

  const handleSave = () => {
    if (!editName.trim()) {
      setError("Project name is required");
      return;
    }
    startTransition(async () => {
      try {
        await updateProject(project.id, { name: editName.trim() });
        setIsEditing(false);
      } catch {
        setError("Failed to update project");
      }
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditName(project.name);
    setError(null);
  };

  const handleDelete = () => {
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      try {
        await deleteProject(project.id);
      } catch {
        setError("Failed to delete project");
      }
    });
  };

  return (
    <div className="bord  er rounded-lg p-4 shadow-sm bg-white max-w-sm relative">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border rounded px-2 py-1 text-sm w-full"
              disabled={isPending}
              autoFocus
            />
            <button
              onClick={handleSave}
              disabled={isPending}
              className="text-green-600 hover:text-green-800"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          project.name
        )}
      </h3>
      <p className="text-xs text-gray-500 mb-2">ID: {project.id}</p>

      <div className="flex gap-3 mt-2">
        {!isEditing && (
          <>
            <button
              onClick={handleView}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
            >
              Open
            </button>
            <button
              onClick={handleEdit}
              className="p-1 text-gray-500 hover:bg-gray-100 rounded"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-red-500 hover:bg-gray-100 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="mt-2 text-xs text-red-600 border border-red-200 p-2 rounded bg-red-50">
          {error}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500 border-t pt-2">
        Created: <ClientDate date={project.createdAt} />
      </div>

      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-lg">
          <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
