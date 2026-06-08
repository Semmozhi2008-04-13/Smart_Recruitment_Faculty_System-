import { useMemo, useState } from 'react';
import { apiPost } from '../services/api';
import toast from 'react-hot-toast';

export default function ScheduleInterviewModal({ onClose, onSuccess }) {
  const [candidateNameInput, setCandidateNameInput] = useState('');
  const [positionNameInput, setPositionNameInput] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [panelInput, setPanelInput] = useState(''); // Renamed state to track panel
  const [venueInput, setVenueInput] = useState(''); // New state for dynamic venue

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const candidateName = useMemo(() => {
    return candidateNameInput.trim() || '-';
  }, [candidateNameInput]);

  const jobName = useMemo(() => {
    return positionNameInput.trim() || '-';
  }, [positionNameInput]);

  const panelistNames = useMemo(() => {
    if (!panelInput) return '-';
    const cleaned = panelInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    return cleaned.length ? cleaned.join(', ') : '-';
  }, [panelInput]);

  const venueName = useMemo(() => {
    return venueInput.trim() || 'CIT Campus (TBD)';
  }, [venueInput]);

  const formatDateTime = (isoLike) => {
    try {
      if (!isoLike) return '-';
      const d = new Date(isoLike);
      if (Number.isNaN(d.getTime())) return isoLike;
      return d.toLocaleString();
    } catch {
      return isoLike || '-';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!candidateNameInput || !positionNameInput || !interviewDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiPost('/api/interviews', {
        candidateId: 999, 
        candidateName: candidateNameInput, 
        jobId: 999,        
        positionName: positionNameInput,   
        interviewType: 'Interview',
        interviewDate,
        interviewRound: 1,
        interviewers: panelInput, // Sending panel inputs to the original key
        mode: 'offline', 
        venue: venueName, // Added venue to payload
        meetingLink: '', 
      });

      setShowSummary(true);
      toast.success('Interview scheduled');
      if (onSuccess) onSuccess(res);
    } catch (err) {
      toast.error('Failed to schedule interview');
    } finally {
      setIsSubmitting(false);
    }
  };

  const summary = useMemo(() => {
    return [
      { label: 'Date/time', value: formatDateTime(interviewDate) },
      { label: 'Candidate name', value: candidateName },
      { label: 'Interview panelist name', value: panelistNames },
      { label: 'Room number', value: 'Room TBD' },
      { label: 'Venue', value: venueName }, // Reflects the custom typed venue
      { label: 'Email sent to the respective candidate', value: 'Pending (email integration not enabled)' },
      { label: 'Reference sent to the interview panelist', value: 'Pending (reference integration not enabled)' },
      { label: 'Updation for next interview schedulings', value: 'Updated (UI) - backend integration pending' },
      { label: 'Job role', value: jobName },
    ];
  }, [candidateName, interviewDate, panelistNames, venueName, jobName]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Schedule Interview</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {showSummary ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="text-sm font-bold text-gray-800 mb-2">Interview Schedule Summary</div>
              <div className="text-xs text-gray-600 mb-3">This summary reflects the scheduled interview details.</div>

              <div className="space-y-2">
                {summary.map((item) => (
                  <div key={item.label} className="flex justify-between gap-4">
                    <div className="text-[12px] font-semibold text-gray-700">{item.label}</div>
                    <div className="text-[12px] text-gray-900 text-right max-w-[55%]">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowSummary(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-100"
              >
                Schedule Another
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Candidate name"
              value={candidateNameInput}
              onChange={(e) => setCandidateNameInput(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />

            <input
              type="text"
              placeholder="Position name"
              value={positionNameInput}
              onChange={(e) => setPositionNameInput(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />

            <input
              type="datetime-local"
              placeholder="Interview Date & Time"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />

            {/* Changed placeholder to Panel */}
            <input
              type="text"
              placeholder="Panel (comma separated)"
              value={panelInput}
              onChange={(e) => setPanelInput(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />

            {/* New Venue entry field */}
            <input
              type="text"
              placeholder="Venue (e.g., CIT Campus, Conference Room A)"
              value={venueInput}
              onChange={(e) => setVenueInput(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}