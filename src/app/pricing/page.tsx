import Navbar from '@/components/Navbar';
import PricingCard from '@/components/paymentCard';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type Props = {};

function page({}: Props) {
  return (
    <div className="relative h-screen w-full bg-white flex flex-col">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      <Navbar />
      <div className="flex items-center justify-center">
        <div className="flex flex-col gap-8 items-center justify-center z-50">
          <Link href="/" className="flex rounded-md flex-row items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <p>Go Back</p>
          </Link>

          <div className="flex flex-col gap-4 md:flex-row">
            <PricingCard priceId="1" pricing="$10" credits="10" />
            <PricingCard priceId="2" pricing="$20" credits="25" />
            <PricingCard priceId="3" pricing="$50" credits="100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
