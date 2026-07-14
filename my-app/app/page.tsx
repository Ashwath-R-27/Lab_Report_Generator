// app/some-page/page.tsx
import { redirect } from 'next/navigation';

export default async function Page() {
  // Logic here (e.g., checking if user has a session)
  
  redirect('/dashboard'); // Instantly sends user to /dashboard
}
