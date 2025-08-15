# 🚀 Multi-Tenant SaaS Dashboard

A modern multi-tenant SaaS application built with **Next.js 15**, **Prisma**, and **Neon Database**. Each project gets its own isolated database for complete tenant separation and data security.

## ✨ Features

- 🏢 **Multi-Tenant Architecture** - Complete data isolation per project
- 🗃️ **Automated Database Provisioning** - Each project gets its own Neon database
- 👥 **User Management** - Add and manage users per project
- 🎨 **Modern UI/UX** - Built with Tailwind CSS and Lucide icons
- ⚡ **Real-time Operations** - Fast project creation and user management
- 🔒 **Secure & Scalable** - Built with industry best practices
- 📱 **Responsive Design** - Works on all device sizes

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Master DB     │    │  Project DB 1   │    │  Project DB 2   │
│  (Projects)     │    │    (Users)      │    │    (Users)      │
│                 │    │                 │    │                 │
│ - id            │    │ - id            │    │ - id            │
│ - name          │    │ - name          │    │ - name          │
│ - databaseUrl   │────┤ - email         │    │ - email         │
│ - createdAt     │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Neon Database account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/multi-tenant-saas-dashboard.git
   cd multi-tenant-saas-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="your-main-database-url"
   
   # Neon API (for creating project databases)
   NEON_API_KEY="your-neon-api-key"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx 
│   ├── page.tsx
│   ├── api/
│   │   └── projects/
│   │       ├── route.ts              # GET/POST projects
│   │       └── [id]/
│   │           ├── route.ts          # GET single project
│   │           └── users/
│   │               └── route.ts      # GET/POST users
│   ├── dashboard/
│   │   ├── layout.tsx 
│   │   ├── page.tsx                  # Projects list
│   │   └── projects/
│   │       └── [id]/
│   │           └── page.tsx          # Project details
│   ├── lib/
│   │   ├── prisma.ts                 # Database client
│   │   ├── neon.ts                   # Neon API integration
│   │   └── project-init.ts           # Database initialization
│   └── types/
│       └── index.ts                  # TypeScript definitions
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Database** | Neon (PostgreSQL) |
| **ORM** | Prisma |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **Deployment** | Vercel (recommended) |

## 📚 API Routes

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/[id]` - Get project details

### Users
- `GET /api/projects/[id]/users` - List users in a project
- `POST /api/projects/[id]/users` - Add user to a project

## 🎯 Usage

1. **Create a Project**
   - Navigate to the dashboard
   - Click "New Project"
   - Enter project name and submit
   - A new Neon database is automatically created

2. **Manage Users**
   - Click on any project to view details
   - Add users with name and email
   - Users are stored in the project's isolated database

3. **Multi-Tenant Benefits**
   - Each project has complete data isolation
   - No shared resources between tenants
   - Easy to scale and manage

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual Deployment

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Neon](https://neon.tech/) for serverless PostgreSQL
- [Prisma](https://prisma.io/) for the excellent ORM
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for beautiful icons

## 📞 Support

If you have any questions or need help, please open an issue or reach out:

- 📧 Email: your-email@example.com
- 🐦 Twitter: [@yourusername](https://twitter.com/yourusername)
- 💼 LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

---

⭐ **Star this repo** if you found it helpful!

**Made with ❤️ using Next.js and Neon**

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
