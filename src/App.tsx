/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  BarChart3, 
  MessageSquareText, 
  Tag, 
  Smile, 
  Frown, 
  Meh, 
  Zap,
  Loader2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ANALYSIS_SCHEMA, SYSTEM_INSTRUCTION } from './constants';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AnalysisResult {
  sentiment: 'Positive' | 'Negative' | 'Neutral' | 'Mixed';
  confidence: number;
  top_themes: string[];
  tone: string;
  is_sarcastic: boolean;
  summary: string;
}

export default function App() {
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeReview = async () => {
    if (!review.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: review,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: ANALYSIS_SCHEMA as any,
          temperature: 0.2,
        },
      });

      const text = response.text;
      if (text) {
        setResult(JSON.parse(text));
      } else {
        throw new Error("No analysis received from the model.");
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Negative': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Neutral': return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
      case 'Mixed': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return <Smile className="w-5 h-5" />;
      case 'Negative': return <Frown className="w-5 h-5" />;
      case 'Neutral': return <Meh className="w-5 h-5" />;
      case 'Mixed': return <Zap className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">ReviewLens AI</h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
            <span>Amazon Sentiment Engine</span>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Gemini 3 Flash</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Analyze Customer Feedback</h2>
              <p className="text-slate-500 leading-relaxed">
                Paste an Amazon product review below to extract deep insights, emotional tone, and hidden sarcasm.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Paste your Amazon review here..."
                  className="w-full h-64 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none text-slate-700 leading-relaxed placeholder:text-slate-400"
                />
                <div className="absolute bottom-4 right-4 text-xs font-mono text-slate-400 bg-white/80 px-2 py-1 rounded border border-slate-100">
                  {review.length} chars
                </div>
              </div>

              <button
                onClick={analyzeReview}
                disabled={loading || !review.trim()}
                className={cn(
                  "w-full h-14 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg",
                  loading || !review.trim() 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" 
                    : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] shadow-indigo-200"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing Review...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Run Analysis</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex gap-3 text-rose-700 text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Main Stats Card */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Overall Sentiment</span>
                        <div className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold w-fit",
                          getSentimentColor(result.sentiment)
                        )}>
                          {getSentimentIcon(result.sentiment)}
                          {result.sentiment}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Confidence</span>
                        <div className="text-2xl font-mono font-bold text-slate-900">
                          {(result.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-slate-900 font-semibold">
                        <MessageSquareText className="w-5 h-5 text-indigo-500" />
                        <h3>Executive Summary</h3>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-lg italic font-serif">
                        "{result.summary}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                          <Smile className="w-4 h-4" />
                          Emotional Tone
                        </div>
                        <p className="font-medium text-slate-700">{result.tone}</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                          <ShieldAlert className="w-4 h-4" />
                          Sarcasm Detected
                        </div>
                        <div className={cn(
                          "px-2.5 py-1 rounded-md text-xs font-bold w-fit",
                          result.is_sarcastic ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
                        )}>
                          {result.is_sarcastic ? "YES" : "NO"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Themes Card */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 text-slate-900 font-semibold">
                      <Tag className="w-5 h-5 text-indigo-500" />
                      <h3>Key Themes & Features</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.top_themes.map((theme, idx) => (
                        <div 
                          key={idx}
                          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 font-medium hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors"
                        >
                          {theme}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900">No Analysis Yet</h3>
                    <p className="text-slate-400 text-sm max-w-[280px]">
                      Enter a review on the left and click "Run Analysis" to see the results here.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-200 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Powered by Gemini 3 Flash</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-600 transition-colors">Documentation</a>
            <a href="#" className="hover:text-slate-600 transition-colors">API Reference</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
