import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const CandidateProfile = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const candidate = state?.candidate;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (candidate) {
            const timer = setTimeout(() => setLoading(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [candidate]);

    const ProfileSegment = ({ title, children, className = "" }) => (
        <div className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm ${className}`}>
            <h3 className="text-gray-800 font-bold mb-4 uppercase text-xs tracking-wider">{title}</h3>
            {loading ? (
                <div className="animate-pulse bg-gray-100 h-16 w-full rounded"></div>
            ) : !candidate ? (
                <p className="text-gray-400 text-sm italic">Please select a candidate to view details.</p>
            ) : children ? (
                children
            ) : (
                <p className="text-gray-500 text-sm italic">No records as of now</p>
            )}
        </div>
    );

    return (

        <div className="max-w-7xl mx-auto p-6 bg-slate-50 min-h-screen">
            {/* Header */}
            <header className="bg-white p-6 rounded-xl border border-gray-200 mb-6 shadow-sm flex items-center gap-4">
                {/* Avatar Box with generic user icon */}
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-800">
                    <User size={32} strokeWidth={2} />
                </div>

                <div>
                    <h1 className="text-2xl font-bold">{candidate ? candidate.name : "Candidate Profile"}</h1>
                    {candidate && <span className="text-sm text-blue-500 font-medium">Interview Scheduled</span>}
                </div>
            </header>

            {/* Main Grid: 3 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: 2/3 Width */}
                <div className="lg:col-span-2 space-y-6">
                    <ProfileSegment title="Professional Summary" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileSegment title="Education" />
                        <ProfileSegment title="Experience" />
                    </div>

                    <ProfileSegment title="Teaching & Research Focus" />
                    <ProfileSegment title="Publications" />
                </div>

                {/* Right Column: 1/3 Width Sidebar */}
                <div className="lg:col-span-1">
                    <ProfileSegment title="Panel Feedback" className="h-full flex flex-col">
                        <div className="mt-auto">
                            <button className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors">
                                Join Panel Discussion
                            </button>
                        </div>
                    </ProfileSegment>
                </div>
            </div>
        </div>
    );
};

export default CandidateProfile;