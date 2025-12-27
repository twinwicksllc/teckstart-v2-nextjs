"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProjectEditModal } from "@/components/projects/project-edit-modal";
import { Navbar } from "@/components/navbar";
import { IncomeForm } from "@/components/incomes/income-form";
import { Project, User } from "@/drizzle.schema";

interface ProjectWithFinancials {
  id: number;
  name: string;
  clientName: string | null;
  clientEmail: string | null;
  description: string | null;
  status: "active" | "completed" | "on_hold" | "cancelled";
  budget: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  userId: number;
  startDate: string | Date | null;
  endDate: string | Date | null;
  totalExpenses?: number;
  totalIncome?: number;
  netProfit?: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithFinancials[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<ProjectWithFinancials | null>(null);
  const [addingIncomeToProject, setAddingIncomeToProject] = useState<ProjectWithFinancials | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/verify");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        // Fetch financials for each project
        const projectsWithFinancials = await Promise.all(
          data.map(async (project: Project) => {
            try {
              const detailsRes = await fetch(`/api/projects/${project.id}`);
              if (detailsRes.ok) {
                const details = await detailsRes.json();
                return {
                  ...project,
                  totalExpenses: details.totalExpenses || 0,
                  totalIncome: details.totalIncome || 0,
                  netProfit: details.netProfit || 0,
                };
              }
            } catch (e) {
              console.error("Error fetching project details:", e);
            }
            return project;
          })
        );
        setProjects(projectsWithFinancials);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project? This will not delete associated expenses but they will become unassigned.")) return;

    try {
      const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (response.ok) {
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user || undefined} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <Link href="/projects/new">
            <Button>Create Project</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {projects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500 mb-4">No projects found.</p>
                <Link href="/projects/new">
                  <Button>Create Your First Project</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            projects.map((project) => (
              <Card key={project.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>{project.clientName || "No client specified"}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'active' ? 'bg-green-100 text-green-800' : 
                      project.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                    <div className="flex space-x-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingProject(project)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Financial Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-100 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Income</p>
                      <p className="text-lg font-semibold text-green-600">
                        ${(project.totalIncome ?? 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Expenses</p>
                      <p className="text-lg font-semibold text-red-600">
                        ${(project.totalExpenses ?? 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Net Profit</p>
                      <p className={`text-lg font-semibold ${
                        (project.netProfit ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(project.netProfit ?? 0) >= 0 ? '' : '-'}${Math.abs(project.netProfit ?? 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => setAddingIncomeToProject(project)}
                      >
                        + Add Income
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Budget</p>
                      <p className="text-lg font-semibold">${project.budget || "0.00"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Client Email</p>
                      <p className="text-lg">{project.clientEmail || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Created</p>
                      <p className="text-lg">{new Date(project.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {project.description && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Description</p>
                      <p className="text-gray-700">{project.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {editingProject && (
        <ProjectEditModal
          project={editingProject as unknown as Project}
          onClose={() => setEditingProject(null)}
          onSave={() => {
            setEditingProject(null);
            fetchProjects();
          }}
        />
      )}

      {/* Add Income Modal */}
      {addingIncomeToProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add Income to {addingIncomeToProject.name}</h2>
                <button 
                  onClick={() => setAddingIncomeToProject(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <IncomeForm 
                preSelectedProjectId={addingIncomeToProject.id}
                onSuccess={() => {
                  setAddingIncomeToProject(null);
                  fetchProjects();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
