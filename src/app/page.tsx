// app/page.tsx
'use client';

import React from 'react';
import { ArrowRight, Database, Users, Shield, Zap, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/dashboard');
  };

  const features = [
    {
      icon: Database,
      title: "Isolated Databases",
      description: "Each project gets its own dedicated Neon database for complete data isolation"
    },
    {
      icon: Users,
      title: "User Management",
      description: "Manage users across multiple projects with seamless multi-tenant architecture"
    },
    {
      icon: Shield,
      title: "Secure & Scalable",
      description: "Built with security and scalability in mind using modern web technologies"
    },
    {
      icon: Zap,
      title: "Fast Setup",
      description: "Create new projects and databases in seconds with automated provisioning"
    }
  ];

  const benefits = [
    "Automatic database provisioning with Neon",
    "Complete tenant isolation",
    "Real-time project management",
    "Scalable architecture",
    "Modern UI/UX"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Database className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">MultiTenant</span>
          </div>
          <button
            onClick={handleGetStarted}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Multi-Tenant SaaS
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Build and manage isolated projects with dedicated databases. 
            Each project gets its own Neon database for complete data separation and security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-lg font-semibold"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Built for Modern SaaS
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to build scalable multi-tenant applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose Our Platform?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Built with industry best practices and modern technologies to ensure 
                your SaaS application scales seamlessly.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-8 rounded-2xl">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Project Overview</h3>
                  <Database className="w-5 h-5 text-blue-500" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">E-commerce App</span>
                    <span className="text-sm text-gray-500">Database ready</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Analytics Platform</span>
                    <span className="text-sm text-gray-500">Database ready</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">CRM System</span>
                    <span className="text-sm text-gray-500">Database ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Database className="w-6 h-6" />
              <span className="text-lg font-semibold">MultiTenant SaaS</span>
            </div>
            <div className="text-gray-400">
              <p>&copy; 2025 MultiTenant SaaS. Built with Next.js, Prisma & Neon.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}