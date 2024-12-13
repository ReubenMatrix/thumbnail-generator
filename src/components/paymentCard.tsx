"use client";


import { redirectToCheckout } from "@/app/actions/stripe";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CircleCheckBig } from "lucide-react";

const PricingCard = ({
  pricing,
  credits,
  priceId,
}: {
  pricing: string;
  credits: string;
  priceId?: string;
}) => {
  return (
    <Card className="h-fit w-60 bg-white z-50 shadow-md">
      <CardHeader>
        <CardTitle>
          <div className="flex items-end gap-2">
            <p>{pricing}</p>
            <p className="text-sm font-normal">/ one-time</p>
          </div>
        </CardTitle>
        <CardDescription>A pack of {credits} credits</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <CircleCheckBig className="h-4 w-4" />
          <p>{credits} credits</p>
        </div>
        <div className="flex items-center gap-2">
          <CircleCheckBig className="h-4 w-4" />
          <p>1 credits = 1 thumbnail</p>
        </div>
      </CardContent>
      <CardFooter>
        {priceId && (
          <Button
            className="mt-6 w-full"
            onClick={async() => {
              await redirectToCheckout(priceId);
            }
          }
          >
            Buy now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PricingCard;