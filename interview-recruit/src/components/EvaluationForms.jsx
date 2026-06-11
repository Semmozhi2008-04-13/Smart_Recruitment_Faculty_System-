import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Info, RotateCcw } from 'lucide-react';

// const CANDIDATE_DETAILS = {};

const EvaluationForms = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const candidateData = location.state?.candidate || {};

    const candidate = state?.candidate;

    // const candidate = state?.candidate || {
    //     candidate: "Placeholder Name",
    //     dept: "Sample Department",
    //     id: "000"
    // };

    if (!candidate) {
        return (
            <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mx-auto mb-4 text-2xl font-bold">
                    ⚠️
                </div>
                <h2 className="text-xl font-bold text-gray-900">No Candidate Selected</h2>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                    Evaluations cannot be submitted anonymously. Please open the Interview Schedule board to select an active candidate.
                </p>
                <button
                    onClick={() => navigate('/interviewschedule')} // Change this to your exact schedule route path
                    className="mt-6 w-full py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-medium rounded-lg shadow-sm transition-colors text-sm"
                >
                    Go to Interview Schedule
                </button>
            </div>
        );
    }

    // Get details from lookup, fallback to defaults
    const details = candidate ? {
        education: candidate.education || "N/A",
        experience: candidate.experience || "N/A",
        room: candidate.venue || candidate.room || "MR - TBA",
        time: candidate.dateTime || candidate.time || "TBA",

        // name: candidate.name || candidate.candidate_name || "",
        // role: candidate.role || "",
        // dept: candidate.dept || ""
    } : null;

    const [loading, setLoading] = useState(true);

    // 1. Initialize criteria scores with null so we can detect unclicked parameters
    const [scores, setScores] = useState({
        "Subject Knowledge": null,
        "Teaching Ability": null,
        "Communication Skills": null,
        "Research Aptitude": null,
        "Problem Solving": null,
        "Confidence & Presentation": null
    });

    const [observations, setObservations] = useState("");
    const [strengths, setStrengths] = useState("");
    const [improvement, setImprovement] = useState("");
    const [selectedRec, setSelectedRec] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const getInitials = (name) => {
        if (!name) return "??";
        const cleanName = name.replace(/(Dr\.|Mr\.|Ms\.|Mrs\.)/gi, "").trim();
        return cleanName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const criteriaList = [
        "Subject Knowledge", "Teaching Ability", "Communication Skills",
        "Research Aptitude", "Problem Solving", "Confidence & Presentation"
    ];

    // 2. Compute the dynamic final score average instantly as criteria buttons are toggled
    const finalScore = useMemo(() => {
        const selectedScores = Object.values(scores).filter(val => val !== null);
        if (selectedScores.length === 0) return 0;

        const totalSum = selectedScores.reduce((sum, val) => sum + val, 0);
        const average = totalSum / selectedScores.length;

        return parseFloat(average.toFixed(2)); // Formats to standard 2-decimal floats
    }, [scores]);

    // 3. Form Submission Handler communicating with the Flask backend
    const handleSubmitEvaluation = async () => {
        // Validation check to verify that all evaluation metrics have been filled out
        const missingScores = Object.values(scores).some(val => val === null);
        if (missingScores || !selectedRec) {
            alert("Please complete all 6 criteria scores and choose a Recommendation before submitting.");
            return;
        }

        const payload = {
            candidate_id: candidate.id,
            candidate_name: candidate.candidate,
            department: candidate.dept,

            // Map individual metrics cleanly
            subject_knowledge: scores["Subject Knowledge"],
            teaching_ability: scores["Teaching Ability"],
            communication_skills: scores["Communication Skills"],
            research_aptitude: scores["Research Aptitude"],
            problem_solving: scores["Problem Solving"],
            confidence_presentation: scores["Confidence & Presentation"],

            // Evaluator derived summaries
            final_score: finalScore,
            observations: observations,
            strengths: strengths,
            improvement: improvement,
            recommendation: selectedRec
        };

        try {
            const response = await fetch('http://127.0.0.1:5002/api/submit-indiv-evaluation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert(`Evaluation for ${candidate.candidate} has been successfully locked and saved!`);
                navigate('/dashboard'); // Reroute back to master view
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error || 'Failed to submit evaluation workspace form.'}`);
            }
        } catch (error) {
            console.error("API Error connecting to database:", error);
            alert("Unable to communicate with the Flask server. Verify your backend process is running on port 5002.");
        }
    };

    if (loading) return <div className="p-8 text-gray-400 animate-pulse">Loading evaluation form...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6 bg-slate-50 min-h-screen">
            {/* Header */}
            <header className="bg-white p-6 rounded-xl border border-gray-200 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-700 text-xl">
                        {getInitials(candidate?.candidate)}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            {candidate?.candidate || "Unknown Candidate"}
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">Current Slot</span>
                        </h1>
                        <p className="text-sm text-gray-500 flex gap-4 mt-1">
                            <span>🎓 {details.education}</span>
                            <span>💻 {candidate?.dept || "N/A"}</span>
                            <span>💼 {details.experience}</span>
                        </p>
                    </div>
                </div>
                <div className="text-right text-sm text-gray-600">
                    <p>🕒 {details.time} (Current Slot)</p>
                    <p className="text-pink-600">📍 {details.room}</p>
                    {/* Visual Live Running Score Tracker */}
                    <p className="text-xs text-gray-400 mt-1 font-mono">Running Average: <span className="text-blue-900 font-bold text-sm">{finalScore}</span> / 5</p>
                </div>
            </header>

            {/* Evaluation Criteria Grid */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-lg">Evaluation Criteria</h2>
                    <span className="text-sm text-gray-500">Scores: 1 (Poor) to 5 (Excellent)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {criteriaList.map((crit) => (
                        <div key={crit} className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium">{crit}</span>
                                <Info size={14} className="text-gray-400" />
                            </div>
                            <div className="flex border rounded overflow-hidden shadow-sm">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <button
                                        key={n}
                                        type="button"
                                        onClick={() => setScores(prev => ({ ...prev, [crit]: n }))}
                                        className={`flex-1 py-1.5 text-xs font-medium border-r last:border-0 transition-all ${scores[crit] >= n
                                                ? 'bg-blue-900 text-white font-bold'
                                                : 'hover:bg-slate-50 bg-white text-gray-700'
                                            }`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detailed Observations */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
                <h2 className="font-bold mb-4">Detailed Observations</h2>
                <label className="text-sm font-medium">Interviewer Observations</label>
                <textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    className="w-full border rounded-lg p-3 mt-1 mb-4 h-24 focus:outline-none focus:ring-1 focus:ring-blue-900"
                    placeholder="General notes about candidate's demeanor..."
                />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Candidate Strengths</label>
                        <textarea value={strengths} onChange={(e) => setStrengths(e.target.value)} className="w-full border rounded-lg p-2 mt-1 h-20 focus:outline-none focus:ring-1 focus:ring-blue-900" placeholder="Highlights..." />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Areas for Improvement</label>
                        <textarea value={improvement} onChange={(e) => setImprovement(e.target.value)} className="w-full border rounded-lg p-2 mt-1 h-20 focus:outline-none focus:ring-1 focus:ring-blue-900" placeholder="Concerns..." />
                    </div>
                </div>
            </div>

            {/* Final Recommendation */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6 flex justify-between items-center">
                <h2 className="font-bold">Final Recommendation</h2>
                <div className="flex gap-2">
                    {['Strongly Recommend', 'Recommend', 'Neutral', 'Reject'].map((rec) => (
                        <button
                            key={rec}
                            type="button"
                            onClick={() => setSelectedRec(rec)}
                            className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${selectedRec === rec ? 'bg-blue-900 text-white border-blue-900' : 'hover:bg-gray-50 border-gray-200 text-gray-700'
                                }`}
                        >
                            {rec}
                        </button>
                    ))}
                </div>
            </div>

            {/* Score Review Panel Summary Component */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6 shadow-sm">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                    <div>
                        <h2 className="font-bold text-gray-800">Form Submission Summary</h2>
                        <p className="text-xs text-gray-400">Review your parameters and aggregated final average before submitting.</p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs text-gray-400 block uppercase font-mono tracking-wider">Calculated Score</span>
                        <span className="text-3xl font-extrabold text-blue-900">{finalScore}</span>
                        <span className="text-gray-400 text-sm font-semibold"> / 5</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {criteriaList.map((crit) => (
                        <div key={crit} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="text-xs font-medium text-gray-600 truncate mr-2">{crit}</span>
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${scores[crit]
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                    : 'bg-rose-50 text-rose-500 border border-dashed border-rose-200'
                                }`}>
                                {scores[crit] || 'Missing'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-between items-center mt-6">
                <button
                    type="button"
                    onClick={() => {
                        setScores({
                            "Subject Knowledge": null, "Teaching Ability": null, "Communication Skills": null,
                            "Research Aptitude": null, "Problem Solving": null, "Confidence & Presentation": null
                        });
                        setObservations(""); setStrengths(""); setImprovement(""); setSelectedRec(null);
                    }}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-rose-600 transition-colors"
                >
                    <RotateCcw size={16} /> Reset Form
                </button>
                <div className="flex gap-4">
                    <button type="button" className="px-6 py-2 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 text-gray-700 transition-colors">Save Draft</button>
                    <button
                        type="button"
                        onClick={handleSubmitEvaluation}
                        className="px-6 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg font-semibold shadow transition-all"
                    >
                        Submit Evaluation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EvaluationForms;