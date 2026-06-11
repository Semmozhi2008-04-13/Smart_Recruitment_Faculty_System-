import React, { useState, useMemo, useEffect } from 'react';
import {
    useReactTable, getCoreRowModel, flexRender
} from '@tanstack/react-table';
import { Calendar, CircleEllipsis, Hourglass, Search } from 'lucide-react';
import KPICard from './reusable/KPICards';

import Pagination, {ITEMS_PER_PAGE} from './reusable/Pagination';



const Dashboard = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [interviewsData, setInterviewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageIndex, setPageIndex] = useState(0);
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');


    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5002/');
                if (!response.ok) throw new Error("Unable to connect to API");

                const rawData = await response.json();

                const formatData = rawData.map(item => ({
                    ...item,
                    name: item.candidate_name || "Unknown Candidate",
                    dept: item.dept || "General Evaluation",
                    role: item.job_title || "Faculty Role",
                    dateTime: item.interview_time || "TBD",
                    status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Pending',
                    initial: (() => {
                        const nameParts = (item.candidate_name || 'Unknown')
                            .split(' ')
                            .filter(word => !['dr.', 'dr', 'prof.', 'prof', 'mr.', 'ms.'].includes(word.toLowerCase()));
                        if (nameParts.length >= 2) {
                            return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
                        }
                        const singleName = nameParts[0] || 'U';
                        return singleName.slice(0, 2).toUpperCase();
                    })(),
                    avatarBg: 'bg-blue-50 text-blue-600',
                    statusClass: (() => {
                        const statusMap = {
                            'completed': 'bg-green-100 text-green-800',
                            'ongoing': 'bg-blue-100 text-blue-800',
                            'scheduled': 'bg-purple-100 text-purple-800',
                            'pending': 'bg-red-100 text-red-800'
                        };
                        return statusMap[item.status.toLowerCase()] || 'bg-gray-100 text-gray-500';
                    })()
                }));
                setInterviewsData(formatData);
            } catch (err) {
                console.error("Dashboard Service Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    // const data = useMemo(() => {
    //     return [];
    // }, []);

    const filteredData = useMemo(() => {
        return interviewsData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
            const matchesDate = !dateFilter || item.dateTime.includes(dateFilter);
            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [interviewsData, search, statusFilter, dateFilter]);

    const kpis = useMemo(() => {
        const total = interviewsData.length;
        const pending = interviewsData.filter(i => i.status.toLowerCase() === 'pending').length;
        const active = interviewsData.filter(i => i.status.toLowerCase() === 'ongoing').length;
        return { total, pending, active };
    }, [interviewsData]);

    const columns = useMemo(() => [
        {
            accessorKey: 'name', header: 'Candidate Name', cell: info => (
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border border-blue-100 ${info.row.original.avatarBg}`}>{info.row.original.initial}</div>
                    <span className="font-medium text-gray-900">{info.getValue()}</span>
                </div>
            )
        },
        { accessorKey: 'dept', header: 'Department' },
        { accessorKey: 'role', header: 'Role' },
        { accessorKey: 'dateTime', header: 'Date & Time' },
        {
            accessorKey: 'status', header: 'Status', cell: info => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${info.row.original.statusClass}`}>{info.getValue()}</span>
            )
        },
    ], []);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel()
    });

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));


    if (loading) {
        return (
            <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center font-medium text-gray-500">
                Syncing dashboard dataset with API stream...
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-1">Interviewer Dashboard</h1>
            <p className="text-gray-500 mb-6">Manage candidate evaluations and department hiring panels.</p>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <KPICard title="Total Assigned" value={String(kpis.total)} icon={Calendar} variant="assigned" />
                <KPICard title="Pending Evaluations" value={String(kpis.pending)} icon={Hourglass} variant="pending-eval" />
                <KPICard title="Progress" value={String(kpis.active)} icon={CircleEllipsis} variant="progress" />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Search and Filters */}
                <div className="p-4 border-b flex gap-3">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        className="border rounded-md px-3 py-2 text-sm flex-grow"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <input
                        type="date"
                        className="border rounded-md px-3 py-2 text-sm"
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                    <select className="border rounded-md px-3 py-2 text-sm" onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="All">Status: All</option>
                        <option value="Completed">Completed</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Pending">Pending</option>
                        <option value="Scheduled">Scheduled</option>
                    </select>
                </div>

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
                                    {row.getVisibleCells().map(cell => <td key={cell.id} className="p-4 text-gray-600">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="p-20 text-center text-gray-500 italic">No records found as of now.</td></tr>
                        )}
                    </tbody>
                </table>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />

            </div>
        </div>
    );
};

export default Dashboard;