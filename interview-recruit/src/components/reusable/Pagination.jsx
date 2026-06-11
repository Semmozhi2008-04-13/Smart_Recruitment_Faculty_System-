import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ITEMS_PER_PAGE = 5;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-between p-4 border-t bg-gray-50">
      <span className="text-xs text-gray-500">Page {currentPage} of {totalPages}</span>
      <div className="flex gap-2">
        <button 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1 border rounded bg-white disabled:opacity-50 hover:bg-gray-50"
        >
          <ChevronLeft size={16} />
        </button>
        
        {/* Dynamic Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button 
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 text-xs border rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50'}`}
          >
            {page}
          </button>
        ))}

        <button 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1 border rounded bg-white disabled:opacity-50 hover:bg-gray-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;