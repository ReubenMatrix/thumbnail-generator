'use client'

import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { ClerkLoading, SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';


const Navbar = () => {
    const [credits, setCredits] = useState<number | null>(null);
  useEffect(() => {
    const syncUserWithPrisma = async () => {
      try {
        const res = await fetch('/api/auth', { method: 'POST' });
        const data = await res.json();
      } catch (error) {
        console.log('Error syncing user:', error);
      }
    };

    syncUserWithPrisma();
  }, []);



  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch('/api/credits');
        const data = await res.json();

        if (res.ok) {
          setCredits(data.credits); 
        } else {
          console.log('Failed to fetch credits:', data.error);
        }
      } catch (error) {
        console.log('Error fetching credits:', error);
      }
    };

    fetchCredits(); 
  }, []);

  

  return (
    <div className="flex flex-row max-w-screen-xl gap-x-3 items-center justify-end py-4 z-50">
      <p className="bg-white z-50 border-2 rounded-md p-2 outline-black hover:cursor-pointer">
        {credits} credits left
      </p>

      <Link href="/pricing">
        <p className="bg-black text-white rounded-md p-2 hover:cursor-pointer">
          Buy now
        </p>
      </Link>

      <SignedIn>
        <UserButton />
      </SignedIn>

      <ClerkLoading>
        <Loader className="h-4 w-5 animate-spin" />
      </ClerkLoading>
    </div>
  );
};

export default Navbar;
