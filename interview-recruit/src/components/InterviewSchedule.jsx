import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';

import Pagination, { ITEMS_PER_PAGE } from './reusable/Pagination';


// const ALL_CANDIDATES = [];

export default function InterviewSchedule() {

    const navigate = useNavigate();

    const [candidates, setCandidates] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageIndex, setPageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [roleFilter, setRoleFilter] = useState('');
    const [deptFilter, setDeptFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState('');
    const [resultPopup, setResultPopup] = useState(null);



    useEffect(() => {
        const fetchLiveSchedule = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('http://127.0.0.1:5002/api/interviews');
                if (!response.ok) throw new Error("Could not read records from the interview service.");

                const rawData = await response.json();

                // 🌟 Translation dictionary mapping DB shorthand codes to full dropdown display values
                const deptMapping = {
                    'CSE': 'Computer Science',
                    'IT': 'Information Technology',
                    'MECH': 'Mechanical Engineering',
                    'MATH': 'Mathematics',
                    'PHYSICS': 'Physics',
                    'CHEMISTRY': 'Chemistry'
                };

                const roleMapping = {
                    'Assistant Professor': 'Asst. Prof',
                    'Associate Professor': 'Assoc. Prof',
                    'Professor': 'Professor'
                };

                // Mapped data safely avoiding scope leaks
                const formatData = rawData.map(item => {
                    // 1. Safely calculate the department string
                    const databaseDeptValue = item.dept || "";
                    const translatedDeptName = deptMapping[databaseDeptValue] || databaseDeptValue || "General Evaluation";

                    const databaseRoleValue = item.job_title || "";
                    const translatedRoleName = roleMapping[databaseRoleValue] || databaseRoleValue || "Faculty Role";

                    const nameParts = (item.candidate_name || 'Unknown')
                        .split(' ')
                        .filter(word => !['dr.', 'dr', 'prof.', 'prof', 'mr.', 'ms.'].includes(word.toLowerCase()));

                    let computedInitials = 'U';
                    if (nameParts.length >= 2) {
                        computedInitials = (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
                    } else if (nameParts[0]) {
                        computedInitials = nameParts[0].slice(0, 2).toUpperCase();
                    }

                    let computedStatusClass = 'bg-gray-100 text-gray-500';
                    if (item.status) {
                        const statusMap = {
                            'completed': 'bg-green-100 text-green-800',
                            'ongoing': 'bg-blue-100 text-blue-800',
                            'scheduled': 'bg-purple-100 text-purple-800',
                            'pending': 'bg-red-100 text-red-800'
                        };
                        computedStatusClass = statusMap[item.status.toLowerCase()] || 'bg-gray-100 text-gray-500';
                    }

                    // Return the fully structured candidate row object
                    return {
                        ...item,
                        name: item.candidate_name || "Unknown Candidate",
                        dept: translatedDeptName, // 🌟 Handled cleanly here!
                        role: item.job_title || "Faculty Role",
                        dateTime: item.interview_time || "TBD",
                        venue: item.venue || "TBA",
                        status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Pending',
                        initial: computedInitials,
                        avatarBg: 'bg-blue-50 text-blue-600',
                        statusClass: computedStatusClass
                    };
                });

                setCandidates(formatData);
                setError(null);

            } catch (err) {
                console.error("Database connection failure:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLiveSchedule();
    }, []);

    const data = useMemo(() => {
        return candidates.filter(item => {
            const matchesRole = roleFilter ? item.role === roleFilter : true;
            const matchesDept = deptFilter ? item.dept === deptFilter : true;

            const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

            const matchesDate = dateFilter ? item.dateTime?.startsWith(dateFilter) : true;

            return matchesRole && matchesDept && matchesStatus && matchesDate;

        });
    }, [candidates, roleFilter, deptFilter, statusFilter, dateFilter]);

    // useEffect(() => {
    //     if (pageIndex > 0) {
    //         setIsLoading(true);
    //         setShowEmpty(false);
    //         const timer = setTimeout(() => { setIsLoading(false); setShowEmpty(true); }, 800);
    //         return () => clearTimeout(timer);
    //     } else {
    //         setIsLoading(false);
    //         setShowEmpty(false);
    //     }
    // }, [pageIndex]);

    const columns = useMemo(() => [
        {
            accessorKey: 'name',
            header: 'Candidate Name',
            cell: (info) => {
                const name = info.getValue();
                const getInitials = (n) => {
                    const cleanName = n.replace(/^(Dr\.|Prof\.|Ms\.|Mr\.|Mrs\.)\s+/i, '');
                    const parts = cleanName.split(' ');
                    return parts.map(p => p[0]).join('').toUpperCase().substring(0, 2);
                };
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-xs border border-blue-100">
                            {getInitials(name)}
                        </div>
                        <span className="font-medium text-gray-900">{name}</span>
                    </div>
                );
            }
        },
        { accessorKey: 'role', header: 'Role' },
        { accessorKey: 'dept', header: 'Department of Interest' },
        { accessorKey: 'dateTime', header: 'Date & Time' },
        { accessorKey: 'venue', header: 'Venue' },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: (info) => {
                const val = info.getValue();
                const colors = { Completed: 'bg-green-100 text-green-800', Ongoing: 'bg-blue-100 text-blue-800', Upcoming: 'bg-gray-100 text-gray-400' };
                return <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[val] || 'bg-gray-100'}`}>{val}</span>;
            }
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: (info) => {
                const rowData = info.row.original;
                const isCompleted = rowData.status === 'Completed';

                return (
                    <div className="flex flex-col gap-2 items-start">
                        {isCompleted ? (
                            <button
                                onClick={() => setResultPopup(rowData)} // Open popup with candidate data
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg border h-8 w-32 flex items-center justify-center bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                            >
                                View Results
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/evaluationforms', {
                                    state: {
                                        candidate: {
                                            id: rowData.id,
                                            name: rowData.name,
                                            candidate: rowData.name,
                                            candidate_name: rowData.name,
                                            dept: rowData.dept,
                                            role: rowData.role,
                                            dateTime: rowData.dateTime,
                                            interview_time: rowData.dateTime,

                                            venue: rowData.venue || "MR - TBA",
                                            education: rowData.education || "TBU",
                                            experience: rowData.experience || "TBU"
                                        }
                                    }
                                })}
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg border h-8 w-32 flex items-center justify-center bg-blue-700 text-white"
                            >
                                Evaluate
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (isCompleted) {
                                    setPopup("Panel Discussions are closed"); // Trigger your existing popup state
                                } else {
                                    navigate('/panelcollaboration', {
                                        state: {
                                            candidate: rowData
                                        }
                                    });
                                }
                            }}
                            className={`px-3 py-1.5 text-xs font-semibold border rounded-lg h-8 w-32 flex items-center justify-center transition-all ${isCompleted
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                                }`}
                        >
                            Panel
                        </button>
                    </div>
                );
            }
        }
    ], [navigate]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    });

      const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
      const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
      const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
      const totalPages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));
    

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-1">Interview Schedule</h1>
            <p className="text-gray-500 mb-6">Plan and coordinate faculty recruitment timelines efficiently.</p>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="font-semibold text-gray-700">Scheduled Interviews</h2>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            className="border rounded-md px-2 py-1 text-sm text-gray-600"
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                        <select className="border rounded-md px-2 py-1 text-sm text-gray-600" onChange={(e) => setRoleFilter(e.target.value)}>
                            <option value="">All Roles</option>
                            <option value="Professor">Professor</option>
                            <option value="Associate Professor">Associate Professor</option>
                            <option value="Assistant Professor">Assistant Professor</option>
                        </select>
                        <select className="border rounded-md px-2 py-1 text-sm text-gray-600" onChange={(e) => setDeptFilter(e.target.value)}>
                            <option value="">All Departments</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                        </select>
                        <select className="border rounded-md px-3 py-2 text-sm" onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="All">Status: All</option>
                            <option value="Completed">Completed</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Scheduled">Scheduled</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-20 text-center text-gray-400">Loading records...</div>
                ) : (
                    <>
                        <table className="w-full text-sm text-left">
                            <thead className="text-gray-500 uppercase text-xs bg-gray-50/50">
                                {table.getHeaderGroups().map(hg => (
                                    <tr key={hg.id}>{hg.headers.map(h => <th key={h.id} className="p-4">{flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.length > 0 ? (
                                    table.getRowModel().rows.map(row => (
                                        <tr key={row.id} className="border-t hover:bg-gray-50">
                                            {row.getVisibleCells().map(cell => (
                                                <td key={`${row.id}-${cell.column.id}`} className="p-4 text-gray-600">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={7} className="p-20 text-center text-gray-500 italic">No records found</td></tr>
                                )}
                            </tbody>
                        </table>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}

                {resultPopup && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setResultPopup(null)}>
                        <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4 border border-slate-100" onClick={(e) => e.stopPropagation()}>

                            {/* Header */}
                            <div className="mb-4">
                                <h3 className="font-bold text-lg text-gray-900">Evaluation Summary</h3>
                            </div>

                            {/* Data Rows */}
                            <div className="space-y-3 mb-6">
                                {/* Candidate Name Block */}
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Candidate Name</p>
                                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{resultPopup.name}</p>
                                </div>

                                {/* Role / Position Block */}
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Assigned Role</p>
                                    <p className="text-sm font-medium text-gray-700 mt-0.5">{resultPopup.role}</p>
                                </div>

                                {/* Status & Decision Badge Block */}
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Interview Status</p>
                                        {/* Dynamically reuses your custom table pill background coloring */}
                                        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${resultPopup.statusClass}`}>
                                            {resultPopup.status}
                                        </span>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Final Decision</p>
                                        {/* Displays 'Strongly Recommend' or similar fields saved to item.recommendation, otherwise falls back gracefully */}
                                        <p className="text-xs font-bold text-blue-900 mt-1">
                                            {resultPopup.recommendation || "Passed Panel Evaluation"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <button
                                type="button"
                                onClick={() => setResultPopup(null)}
                                className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm"
                            >
                                Close Summary Window
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}