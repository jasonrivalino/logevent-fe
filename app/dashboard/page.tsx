// app/dashboard/page.tsx
'use client';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  useAuth();

  return (
    <div>
      <main className="flex flex-col items-center justify-center min-h-screen py-2 md:pt-20">
        <footer className="w-full bg-gray-200 text-gray-700 py-4 text-center font-sofia">
          <p>&copy; 2024 Logevent. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
