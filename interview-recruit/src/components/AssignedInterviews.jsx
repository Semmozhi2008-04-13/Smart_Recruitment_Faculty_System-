import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Pagination, {ITEMS_PER_PAGE} from './reusable/Pagination';

const AssignedInterviews = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [error, setError] = useState(null);
  const [allInterviews, setAllInterviews] = useState([]);

  useEffect(() => {
    const fetchAssignedSchedules = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:5002/api/interviews');
        if (!response.ok) throw new Error("Could not populate assignments data.");

        const dbPayload = await response.json();

        const deptMapping = {
          'CSE': 'Computer Science',
          'IT': 'Information Technology',
          'MECH': 'Mechanical Engineering',
          'MATH': 'Mathematics',
          'PHYSICS': 'Physics',
          'CHEMISTRY': 'Chemistry'
        };

        const formattedData = dbPayload.map(item => {
          const rawDept = item.dept || "";
          const translatedDeptName = deptMapping[rawDept] || rawDept || "General Evaluation";

          return {
            id: item.id,
            name: item.candidate_name || "Unknown Candidate",
            dept: translatedDeptName, // Intercepts 'CSE' cleanly here
            role: item.job_title || "Faculty Role",
            time: item.interview_time || "TBD",
            venue: item.venue || "MR - TBA",
            status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Pending',
            action: item.status?.toLowerCase() === 'completed' ? 'Results' : 'Profile'
          };
        });

        setAllInterviews(formattedData);
        setError(null);
      } catch (err) {
        console.error("Assignment Fetch Breakdown:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedSchedules();
  }, []);

  useEffect(() => {
    if (currentPage > 1 || searchTerm || deptFilter !== 'All' || statusFilter !== 'All') {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [currentPage, searchTerm, deptFilter, statusFilter]);

  const handleAction = (item) => {
    if (item.action === 'Profile') {
      navigate('/candidateprofile', { state: { candidate: item } });
    } else {
      alert(`Summary results for ${item.name}: Passed panel evaluation.`);
    }
  }

  const getInitials = (nameStr) => {
    if (!nameStr) return "U";
    const clean = nameStr.replace(/(dr\.|prof\.|mr\.|ms\.)/i, '').trim();
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0] ? parts[0].slice(0, 2).toUpperCase() : "U";
  };

  const dynamicTimeline = [...allInterviews]
    .filter(item => item.status === 'Ongoing' || item.status === 'Scheduled' || item.status === 'Pending')
    .sort((a, b) => a.time.localeCompare(b.time));

  const filteredData = allInterviews.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || item.dept === deptFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));

  return (
    <div className="flex flex-col gap-3 p-3">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assigned Interviews</h1>
        <p className="text-gray-500 text-sm">Manage and track your assigned faculty interview sessions.</p>
      </div>

      {error && (
        <div className="p-3 text-sm bg-red-50 text-red-600 rounded-lg border border-red-100">
          Error syncing dashboard context: {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <div className="lg:col-span-3 flex flex-col gap-3">

          <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200">
            <Search size={16} className="text-gray-400" />
            <input type="text" placeholder="Candidate name..." className="border rounded-md px-3 py-2 text-sm flex-1" onChange={(e) => setSearchTerm(e.target.value)} />

            <select className="border rounded-md px-3 py-2 text-sm" onChange={(e) => setDeptFilter(e.target.value)}>
              <option value="All">All Departments</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mechanical Engineeering">Mechanical Engineering</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
            </select>

            <select className="border rounded-md px-3 py-2 text-sm" onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">Status: All</option>
              <option value="Completed">Completed</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-left text-gray-500 uppercase text-[10px]">
                <tr>
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Dept</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? <tr><td colSpan="6" className="p-20 text-center text-gray-400 italic">Fetching from database...</td></tr> :
                  currentPage === 1 ? filteredData.map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-xs">{getInitials(item.name)}</div>
                        {item.name}
                      </td>
                      <td className="p-4 text-gray-600">{item.dept}</td>
                      <td className="p-4 text-gray-600">{item.role}</td>
                      <td className="p-4 text-gray-600">{item.time}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          item.status === 'Ongoing' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>{item.status}</span>
                      </td>
                      <td className="p-4">
                        {/* onClick handler to trigger navigation */}
                        <button
                          onClick={() => handleAction(item)}
                          className={`px-4 py-1.5 text-xs font-semibold rounded ${item.action === 'Profile' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                          {item.action}
                        </button>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="6" className="p-20 text-center text-gray-500 italic">No records found as of now</td></tr>}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        {/* Right Sidebar*/}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-bold mb-4 text-base">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <button className="flex items-center gap-3 p-3 border rounded text-sm hover:bg-gray-50"><FileText size={18} /> Pending Evaluations</button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-base">Upcoming Today</h3>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
              </span>
            </div>
            <div className="space-y-8 border-l-2 border-gray-100 ml-3 pl-5">
              {dynamicTimeline.map((item, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[27px] w-4 h-4 rounded-full border-2 border-white ${item.status === 'Ongoing' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <p className="text-xs font-bold text-blue-700">{item.time}</p>
                  <p className="text-sm font-semibold mt-1">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.venue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AssignedInterviews;