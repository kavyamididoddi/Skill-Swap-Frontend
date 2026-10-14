import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Sparkles,
  ArrowRightLeft,
  Calendar,
  Star,
  CheckCircle2,
  GraduationCap,
  ArrowRight
} from 'lucide-react';

export const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Full-Stack Peer-to-Peer Learning Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Teach what you know. <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">
                Learn what you don't.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
              SkillSwap connects students to exchange knowledge directly. If you excel in Web Development and want to learn Graphic Design, find a peer to swap skills with — free, collaborative, and peer-driven.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-105"
                >
                  Go to Dashboard <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-105"
                  >
                    Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors"
                  >
                    Sign In with Demo Account
                  </Link>
                </>
              )}
            </div>

            {/* Popular skills tags preview */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2">Popular:</span>
              {['React', 'Java Spring Boot', 'UI/UX Design', 'Python', 'Figma', 'Spanish', 'Acoustic Guitar'].map((s) => (
                <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Engineered for Student Collaboration
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              A comprehensive system connecting classroom theory with practical full-stack application development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Matching Engine</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Bi-directional matching automatically discovers students whose teaching and learning interests overlap, scoring both mutual swaps and one-way mentorship opportunities.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-4">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Proposals &amp; Requests</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Send tailored swap proposals specifying what you offer in exchange for what you learn. Accept or decline with live status workflows.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Scheduling &amp; Ratings</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Coordinate interactive 1-on-1 sessions, add virtual meeting links, track completion, and leave 5-star peer reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 SkillSwap — Full-Stack Java (Spring Boot) + React &amp; MySQL Platform.</p>
        </div>
      </footer>
    </div>
  );
};
