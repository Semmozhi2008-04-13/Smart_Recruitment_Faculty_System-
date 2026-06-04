import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiGet, apiPatch } from '../services/api';

const PAGE_SIZE = 6;

export default function Selection() {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchParams] = useSearchParams();
  const [typedSearchTerm, setTypedSearchTerm] = useState(null);
  const searchTerm = typedSearchTerm ?? searchParams.get('search') ?? '';
  const [filterRec, setFilterRec] = useState('Recommendation');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isMounted = true;
    apiGet('/api/selection')
      .then((data) => {
        if (isMounted) {
          setCandidates(data);
          setLoadError('');
        }
      })
      .catch(() => {
        if (isMounted) setLoadError('Unable to load selection data from database.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredCandidates = candidates.filter((candidate) => {
    const recommendation = `${candidate.type} ${candidate.subType}`.trim();
    const matchesSearch = !normalizedSearch || [
      candidate.name,
      candidate.initials,
      recommendation,
      candidate.score,
      candidate.decision || '',
    ].some((value) => String(value).toLowerCase().includes(normalizedSearch));

    const matchesRecommendation =
      filterRec === 'Recommendation' || recommendation === filterRec;

    return matchesSearch && matchesRecommendation;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStart = (safeCurrentPage - 1) * PAGE_SIZE;
  const visibleCandidates = filteredCandidates.slice(pageStart, pageStart + PAGE_SIZE);

  // Handle updates to candidate selection status
  const handleDecision = (id, choice) => {
    apiPatch(`/api/selection/${id}`, { decision: choice }).catch(() => {
      setLoadError('Decision saved locally, but database update failed.');
    });
    setCandidates(prev =>
      prev.map(c => c.id === id ? { ...c, decision: choice } : c)
    );
  };

  const handleEmailAction = (name) => {
    alert(`Initiating email flow execution sequence for ${name}`);
  };

  return (
    <div className="w-full font-sans antialiased text-gray-800">
      
      {/* Filter Bar */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[280px] relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input 
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 text-body-md outline-none" 
              type="text" 
              value={searchTerm}
              onChange={(e) => {
                setTypedSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search candidates..."
            />
          </div>
          <div className="w-64">
            <select 
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/20 text-body-md appearance-none outline-none"
              value={filterRec}
              onChange={(e) => {
                setFilterRec(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option>Recommendation</option>
              <option>Strong Recommended</option>
              <option>Recommended</option>
              <option>Not Recommended</option>
            </select>
          </div>
          <button
            onClick={() => {
              setTypedSearchTerm('');
              setFilterRec('Recommendation');
              setCurrentPage(1);
            }}
            className="p-3 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-center"
            title="Reset filters"
          >
            <span className="material-symbols-outlined text-primary">filter_list</span>
          </button>
        </div>
      </section>

      {/* Final Score and Determination Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        {loadError && <div className="px-6 py-3 bg-red-50 text-red-700 text-sm font-semibold">{loadError}</div>}
        <div className="px-6 py-5 border-b border-outline-variant">
          <h2 className="text-headline-md font-headline-md text-on-surface">Final Score and Determination</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Candidate Name</th>
                <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Recommendation</th>
                <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Final Score</th>
                <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Decision</th>
                <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Generate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {visibleCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-surface-container-low/30 transition-colors h-row-height">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant font-bold text-label-md shrink-0">
                        {candidate.initials}
                      </div>
                      <span className="font-bold text-on-surface whitespace-nowrap">{candidate.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-body-md font-medium text-on-surface">{candidate.type}</span>
                      {candidate.subType && (
                        <span className="text-body-sm text-on-surface-variant">{candidate.subType}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-headline-sm font-headline-sm">{candidate.score}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDecision(candidate.id, 'Selected')}
                        className={`px-4 py-1.5 rounded-full text-body-sm font-semibold transition-colors ${
                          candidate.decision === 'Selected' 
                            ? 'bg-[#2e7d32] text-white shadow-sm' 
                            : 'bg-[#e8f5e9] text-[#2e7d32] hover:bg-[#c8e6c9]'
                        }`}
                      >
                        Selected
                      </button>
                      <button 
                        onClick={() => handleDecision(candidate.id, 'Rejected')}
                        className={`px-4 py-1.5 rounded-full text-body-sm font-semibold transition-colors ${
                          candidate.decision === 'Rejected' 
                            ? 'bg-[#c62828] text-white shadow-sm' 
                            : 'bg-[#ffebee] text-[#c62828] hover:bg-[#ffcdd2]'
                        }`}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-primary-container cursor-pointer hover:scale-110 transition-transform" title="View Report">
                        visibility
                      </span>
                      <button 
                        onClick={() => handleEmailAction(candidate.name)}
                        className="px-6 py-1.5 border border-outline rounded-lg text-body-sm font-semibold hover:bg-surface-container transition-colors"
                      >
                        Email
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleCandidates.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-body-md font-semibold text-on-surface-variant">
                    {isLoading ? 'Loading selection data from database...' : 'No candidates match your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="text-body-sm font-medium text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full font-bold text-body-sm flex items-center justify-center transition-colors ${
                    safeCurrentPage === page
                      ? 'bg-primary text-on-primary'
                      : 'hover:bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              disabled={safeCurrentPage === totalPages}
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              className="text-body-sm font-medium text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="text-body-sm text-on-surface-variant">
            Showing {filteredCandidates.length === 0 ? 0 : pageStart + 1} to {Math.min(pageStart + PAGE_SIZE, filteredCandidates.length)} of {filteredCandidates.length} entries
          </div>
        </div>
      </div>

      {/* Atmospheric Metric Metric Cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <h3 className="text-label-md font-label-md text-on-surface-variant mb-2">Total Candidates</h3>
          <div className="flex items-end gap-2">
            <span className="text-headline-lg font-headline-lg">124</span>
            <span className="text-body-sm text-[#2e7d32] font-semibold mb-1.5">+12% from last term</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary-container/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <h3 className="text-label-md font-label-md text-on-surface-variant mb-2">Pending Selection</h3>
          <div className="flex items-end gap-2">
            <span className="text-headline-lg font-headline-lg">18</span>
            <span className="text-body-sm text-[#c62828] font-semibold mb-1.5">-3 to complete</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary-container/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <h3 className="text-label-md font-label-md text-on-surface-variant mb-2">Average Score</h3>
          <div className="flex items-end gap-2">
            <span className="text-headline-lg font-headline-lg">82.5</span>
            <span className="text-body-sm text-primary font-semibold mb-1.5">Across all departments</span>
          </div>
        </div>
      </div>

    </div>
  );
}
