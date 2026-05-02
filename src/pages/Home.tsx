import React from "react";
import { Link } from "react-router-dom";
import { Users, Play } from "lucide-react";

const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/captain-momasry.jpg"
          alt="Captain MoMasry"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dark Gradient Overlay (Top Only) */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-black via-black/70 to-transparent" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="pt-12 pb-8 text-center">
          <h1 className="text-6xl font-black text-white mb-2 tracking-wider">
            MoMasry
          </h1>
          <p className="text-xl font-semibold text-gray-300 tracking-wide">
            ASSESS PRO • PERFORMANCE COACHING
          </p>
        </div>

        {/* Tagline on Chest Area */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-2xl px-8">
            <h2 className="text-3xl font-bold text-white mb-8">
              Performance Starts with{" "}
              <span className="text-neon-yellow font-black">Assessment</span>
            </h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pb-16 px-8">
          <div className="max-w-md mx-auto space-y-4">
            <Link
              to="/clients"
              className="btn-primary w-full flex items-center justify-center space-x-3 text-lg py-4"
            >
              <Users size={24} />
              <span>Clients</span>
            </Link>

            <button className="btn-secondary w-full flex items-center justify-center space-x-3 text-lg py-4">
              <Play size={24} />
              <span>Start New Assessment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
