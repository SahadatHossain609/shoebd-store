import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Check, Trash2 } from 'lucide-react';

const AdminReviews = () => {
  const { reviews, approveReview, deleteReview } = useStore();
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const confirmDelete = () => {
    if (reviewToDelete) {
      deleteReview(reviewToDelete);
      setReviewToDelete(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Reviews Management</h1>
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews to manage.</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="border border-gray-100 rounded-xl p-4 flex justify-between items-center bg-gray-50">
                <div>
                  <h4 className="font-bold text-gray-900">{review.userName} <span className="text-sm font-normal text-gray-500">for Product {review.productId}</span></h4>
                  <p className="text-gray-600 mt-1">{review.comment}</p>
                  <p className="text-xs text-yellow-600 font-bold mt-2">Rating: {review.rating}/5</p>
                </div>
                <div className="flex space-x-2">
                  {review.status === 'Pending' && (
                    <button 
                      onClick={() => approveReview(review.id)}
                      className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      title="Approve"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => setReviewToDelete(review.id)}
                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {reviewToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this review? This action cannot be undone.</p>
            <div className="flex space-x-3 justify-end">
              <button 
                onClick={() => setReviewToDelete(null)}
                className="px-4 py-2 text-gray-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
