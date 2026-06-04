import { useEffect, useState } from 'react';
import { apiDelete, apiGet } from '../services/api';

const PAGE_SIZE = 5;

export default function Evaluation() {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isMounted = true;
    apiGet('/api/evaluation')
      .then((data) => {
        if (isMounted) {
          setCandidates(data);
          setLoadError('');
        }
      })
      .catch(() => {
        if (isMounted) setLoadError('Unable to load evaluation data from database.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(candidates.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStart = (safeCurrentPage - 1) * PAGE_SIZE;
  const visibleCandidates = candidates.slice(pageStart, pageStart + PAGE_SIZE);

  const handleRemoveCandidate = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the evaluation?`)) {
      apiDelete(`/api/evaluation/${id}`).catch(() => {
        setLoadError('Candidate removed locally, but database delete failed.');
      });
      const nextCandidates = candidates.filter((candidate) => candidate.id !== id);
      setCandidates(nextCandidates);
      setCurrentPage((page) => Math.min(page, Math.max(1, Math.ceil(nextCandidates.length / PAGE_SIZE))));
    }
  };

  return (
    <div className="p-6 font-['Manrope'] bg-transparent antialiased text-slate-800 w-full">
      <div className="bg-white rounded-[8px] border border-outline-variant shadow-sm flex flex-col overflow-hidden">
        {loadError && <div className="px-6 py-3 bg-red-50 text-red-700 text-sm font-semibold">{loadError}</div>}

        <div className="px-6 py-4 border-b border-outline-variant">
          <h1 className="text-lg font-bold text-primary-container">Final Score and determination</h1>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-[11px] uppercase tracking-wider text-on-surface-variant font-bold border-b border-outline-variant">
                <th className="px-6 py-4">Candidate Name</th>
                <th className="px-6 py-4">AI Score</th>
                <th className="px-6 py-4">Panel Score</th>
                <th className="px-6 py-4">Recommendation</th>
                <th className="px-6 py-4">Final Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-sm text-on-surface-variant">
              {visibleCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container text-xs font-bold mr-3 shrink-0">
                        {candidate.initials}
                      </div>
                      <span className="font-bold text-on-surface whitespace-nowrap">{candidate.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{candidate.aiScore}</td>
                  <td className="px-6 py-4 font-medium whitespace-nowrap">{candidate.panelScore}</td>
                  <td className="px-6 py-4 font-medium whitespace-nowrap">{candidate.recommendation}</td>
                  <td className="px-6 py-4 font-bold text-on-surface">{candidate.finalScore}</td>
                  <td className="px-6 py-4">
                    <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-3">
                      <button className="text-primary-container hover:text-primary transition-transform hover:scale-105" title="View Profile">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                      <button className="border border-outline-variant px-3 py-1 rounded-[8px] text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors">
                        move
                      </button>
                      <button
                        onClick={() => handleRemoveCandidate(candidate.id, candidate.name)}
                        className="text-error border border-error hover:bg-error/5 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                        title="Remove Candidate"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleCandidates.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center font-semibold">
                    {isLoading ? 'Loading evaluation data from database...' : 'No evaluation records found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="px-6 py-4 border-t border-outline-variant flex justify-end items-center space-x-2 bg-surface-container-lowest">
          <span className="mr-auto text-sm text-on-surface-variant">
            Showing {candidates.length === 0 ? 0 : pageStart + 1} to {Math.min(pageStart + PAGE_SIZE, candidates.length)} of {candidates.length}
          </span>
          <button disabled={safeCurrentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="px-3 py-1 text-sm text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-[8px] text-sm font-bold flex items-center justify-center transition-colors ${safeCurrentPage === page ? 'bg-primary-container text-white' : 'hover:bg-surface-container-low text-on-surface-variant'}`}>
              {page}
            </button>
          ))}
          <button disabled={safeCurrentPage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="px-3 py-1 text-sm text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Next
          </button>
        </footer>
      </div>
    </div>
  );
}
