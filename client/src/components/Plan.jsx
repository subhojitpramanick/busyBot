import React from "react";
import { PricingTable } from "@clerk/clerk-react";

const Plan = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center animate-fade-in-down">
        <h2 className="text-base font-semibold leading-7 text-purple-600">
          Pricing
        </h2>
        <p className="mt-2 font-serif text-4xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent sm:text-5xl">
          Choose The Perfect Plan
        </p>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
          Simple, transparent pricing. Unlock premium features and take your
          creativity to the next level.
        </p>
      </div>

      <div
        className="mt-16 sm:mt-20 animate-fade-in-up"
        style={{ animationDelay: "300ms", animationFillMode: "backwards" }}
      >
        <PricingTable />
      </div>
    </div>
  );
};

export default Plan;
