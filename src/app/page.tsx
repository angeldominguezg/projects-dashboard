import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-8 max-w-4xl w-full px-4">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
          Clients Projects Dashboard
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Gestiona tus proyectos y clientes en un solo lugar
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-40 text-lg">
              TEST: Dashboard
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-40 text-lg">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-40 text-lg border-2"
            >
              Register
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
