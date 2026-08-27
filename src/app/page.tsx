import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🌍 AMA Hookup
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with locals instantly. Meet, chat, and discover.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/auth/login"
              className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              Sign In
            </a>
            <a
              href="/auth/signup"
              className="px-6 py-3 bg-white text-primary-500 rounded-lg font-medium border-2 border-primary-500 hover:bg-primary-50 transition-colors"
            >
              Create Account
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Connect
            </h3>
            <p className="text-gray-600">
              Find and connect with interesting locals in your area
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chat
            </h3>
            <p className="text-gray-600">
              Have real conversations with people nearby
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Rate
            </h3>
            <p className="text-gray-600">
              Build trust with ratings and reviews
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}