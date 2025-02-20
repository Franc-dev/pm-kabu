├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── verify/
│   │   │       └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── projects/
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── tasks/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── documents/
│   │   │   │       └── page.tsx
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── teams/
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── members/
│   │   │   │       └── page.tsx
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts
│   │   │   │   └── verify/
│   │   │   │       └── route.ts
│   │   │   ├── projects/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   ├── tasks/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── documents/
│   │   │   │   │       └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── teams/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── members/
│   │   │   │   │       └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── uploads/
│   │   │       └── route.ts
│   │   ├── error.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   └── register-form.tsx
│   │   ├── projects/
│   │   │   ├── project-card.tsx
│   │   │   ├── project-form.tsx
│   │   │   ├── task-board.tsx
│   │   │   └── document-list.tsx
│   │   ├── teams/
│   │   │   ├── team-card.tsx
│   │   │   └── member-list.tsx
│   │   ├── shared/
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── loading.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       └── modal.tsx
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── jwt.ts
│   │   │   ├── password.ts
│   │   │   └── middleware.ts
│   │   ├── db/
│   │   │   ├── index.ts
│   │   │   └── schema.ts
│   │   └── utils/
│   │       ├── api.ts
│   │       └── validation.ts
│   ├── types/
│   │   └── index.ts
│   └── config/
│       └── site.ts
├── public/
│   └── images/
├── drizzle.config.ts
├── middleware.ts
└── tsconfig.json