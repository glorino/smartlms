# SmartLMS

> The #1 AI-Powered Learning Management System - Combining the best features of Tutor LMS, LearnDash, and MasterStudy

![SmartLMS](https://img.shields.io/badge/SmartLMS-6366f1?style=for-the-badge&logo=graduationcap&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

## Features

### From Tutor LMS
- AI Studio with 5+ AI models (OpenAI, Gemini, Claude, Grok, Mistral)
- 14 quiz question types
- Native eCommerce with 10+ payment gateways
- Live classes (Zoom, Google Meet, Jitsi, YouTube Live)
- Certificate builder with QR verification
- Content drip and prerequisites
- Gradebook and analytics

### From LearnDash
- Focus mode for distraction-free learning
- SCORM/xAPI support
- Challenge exams (test out)
- ProPanel analytics dashboard
- Achievements and gamification
- Groups, cohorts, and seat-based pricing
- Multi-instructor management

### From MasterStudy
- 50+ Elementor widgets
- Direct student-instructor messaging
- Point system and gamification
- PDF and audio lessons
- Udemy course importer
- SCORM package import
- 21 language translations

### Unique Features
- AI-powered course outline generation
- Real-time analytics dashboard
- Certificate verification system
- Student notes and Q&A
- Mobile-responsive design
- REST API for integrations

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma 7
- **Auth:** NextAuth.js v5
- **Icons:** Lucide React
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **Payments:** Flutterwave

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Neon PostgreSQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/smartlms.git

# Navigate to project directory
cd smartlms

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and secrets

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed the database
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."
OPENAI_API_KEY="sk-..."
```

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smartlms.com | admin123 |
| Instructor | instructor@smartlms.com | instructor123 |
| Student | student@smartlms.com | student123 |

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
# Or use Vercel CLI
npx vercel
```

## Project Structure

```
smartlms/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeder
├── src/
│   ├── app/
│   │   ├── (auth)/        # Auth pages (login, register)
│   │   ├── (dashboard)/   # Student dashboard
│   │   ├── (admin)/       # Admin dashboard
│   │   ├── api/           # API routes
│   │   ├── courses/       # Course pages
│   │   ├── quiz/          # Quiz pages
│   │   └── certificate/   # Certificate verification
│   ├── components/
│   │   ├── ui/            # UI components
│   │   ├── layout/        # Layout components
│   │   ├── courses/       # Course components
│   │   ├── quiz/          # Quiz components
│   │   └── dashboard/     # Dashboard components
│   ├── lib/               # Utilities
│   ├── types/             # TypeScript types
│   └── hooks/             # Custom hooks
├── vercel.json
└── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| GET | /api/courses | List courses |
| POST | /api/courses | Create course |
| GET | /api/courses/[id] | Get course |
| PUT | /api/courses/[id] | Update course |
| DELETE | /api/courses/[id] | Delete course |
| GET | /api/enrollments | List enrollments |
| POST | /api/enrollments | Enroll in course |
| GET | /api/quizzes | List quizzes |
| POST | /api/quizzes | Create quiz |
| POST | /api/quizzes/[id] | Submit quiz |
| GET | /api/certificates | List certificates |
| POST | /api/certificates | Issue certificate |
| GET | /api/certificates/[id] | Verify certificate |
| GET | /api/analytics | Get analytics |
| POST | /api/ai/generate | Generate AI content |

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- Documentation: [docs.smartlms.vercel.app](https://smartlms.vercel.app)
- Issues: [GitHub Issues](https://github.com/yourusername/smartlms/issues)
- Email: support@smartlms.vercel.app

---

Built with ❤️ by SmartLMS Team
