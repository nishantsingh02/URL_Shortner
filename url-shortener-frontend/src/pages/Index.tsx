import React from "react";
import UrlShortener from "@/components/UrlShortener";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="relative py-32 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={heroImage} 
            alt="URL Shortener Hero Background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="relative z-10 container mx-auto text-center space-y-8">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              URL Shortener
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Transform your long URLs into clean, professional short links that are easy to share and track
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-6 pt-16">
        <div className="container mx-auto">
          <UrlShortener />
        </div>
      </section>
    </div>
  );
};

export default Index;
