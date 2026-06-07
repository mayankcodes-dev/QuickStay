import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StarRating from './StarRating';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const AMENITY_ICONS = {
  'Free Wi-Fi':       '📶',
  'Free Breakfast':   '🍳',
  'Room Service':     '🛎️',
  'Pool Access':      '🏊',
  'Mountain View':    '🏔️',
  'AC':               '❄️',
  'Parking':          '🅿️',
  'Gym':              '💪',
  'Spa':              '💆',
  'Bar':              '🍹',
  'Restaurant':       '🍽️',
  'Laundry':          '👔',
  'Airport Shuttle':  '🚌',
  'Pet Friendly':     '🐾',
  'TV':               '📺',
  'Geyser':           '🚿',
  'Mini Bar':         '🍾',
  'King Bed':         '🛏️',
};

const StarPicker = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(n => (
      <button key={n} type="button" onClick={() => onChange(n)}
        className="text-2xl transition-transform hover:scale-110"
        style={{ color: n <= value ? '#FBBF24' : 'var(--color-border)' }}
        aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
      >
        ★
      </button>
    ))}
  </div>
);

const ReviewForm = ({ hotelId, roomId, onReviewAdded }) => {
  const { axios, user, navigate } = useAppContext();
  const [rating,  setRating]  = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to write a review'); navigate('/login'); return; }
    if (comment.trim().length < 10) { toast.error('Review must be at least 10 characters'); return; }
    setSubmitting(true);
    try {
      const { data } = await axios.post('/api/reviews', { hotel: hotelId, room: roomId, rating, comment });
      if (data.success) {
        toast.success('✅ Review submitted!');
        setComment('');
        setRating(5);
        onReviewAdded?.(data.review);
      } else toast.error(data.message);
    } catch (err) { toast.error(err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)' }}>
      <h4 className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>Write a Review</h4>
      <div>
        <p className="text-xs mb-1.5 font-medium" style={{ color: 'var(--color-text-muted)' }}>Your Rating</p>
        <StarPicker value={rating} onChange={setRating} />
      </div>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Share your experience…"
        rows={3}
        maxLength={500}
        className="w-full rounded-xl px-4 py-3 text-sm border outline-none resize-none transition-colors"
        style={{
          background: 'var(--color-surface-2)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-primary)',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
        onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{comment.length}/500</span>
        <button type="submit" disabled={submitting} className="btn-primary text-sm py-2 px-5 disabled:opacity-60">
          {submitting ? 'Posting…' : 'Post Review'}
        </button>
      </div>
    </form>
  );
};

const ReviewCard = ({ review }) => {
  const initials = review.user?.username?.[0]?.toUpperCase() || '?';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-4"
      style={{ background: 'var(--color-surface-3)' }}
    >
      <div className="flex items-start gap-3 mb-2">
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0"
          style={{ background: 'linear-gradient(135deg,#E8003D,#9B001F)' }}>
          {review.user?.image
            ? <img src={review.user.image} alt="" className="w-9 h-9 rounded-full object-cover" />
            : initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <span className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
              {review.user?.username || 'Guest'}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <StarRating rating={review.rating} />
            <span className="text-xs ml-1 font-semibold" style={{ color: '#FBBF24' }}>{review.rating}.0</span>
          </div>
        </div>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{review.comment}</p>
      {review.ownerResponse && (
        <div className="mt-3 pl-3 border-l-2 border-primary">
          <p className="text-xs font-bold mb-0.5" style={{ color: 'var(--color-primary)' }}>🏨 Hotel Response</p>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{review.ownerResponse}</p>
        </div>
      )}
    </motion.div>
  );
};

const ReviewSection = ({ hotelId, roomId }) => {
  const { axios } = useAppContext();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (!hotelId) return;
    axios.get(`/api/reviews/hotel/${hotelId}`)
      .then(({ data }) => { if (data.success) setReviews(data.reviews); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [hotelId]);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const onReviewAdded = (review) => setReviews(prev => [review, ...prev]);

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="font-bold text-xl font-display" style={{ color: 'var(--color-text-primary)' }}>
          Guest Reviews
        </h3>
        {avgRating && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{ background: 'var(--color-surface-3)' }}>
            <span className="text-base">⭐</span>
            <span className="font-black text-sm" style={{ color: 'var(--color-primary)' }}>{avgRating}</span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>({reviews.length} reviews)</span>
          </div>
        )}
      </div>

      {/* Write review form */}
      <ReviewForm hotelId={hotelId} roomId={roomId} onReviewAdded={onReviewAdded} />

      {/* Reviews list */}
      <div className="flex flex-col gap-3 mt-5">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)
        ) : reviews.length === 0 ? (
          <p className="text-sm py-6 text-center" style={{ color: 'var(--color-text-muted)' }}>
            Be the first to review this property ✍️
          </p>
        ) : (
          reviews.map(r => <ReviewCard key={r._id} review={r} />)
        )}
      </div>
    </div>
  );
};

export { AMENITY_ICONS, ReviewSection, ReviewCard, ReviewForm, StarPicker };
export default ReviewSection;
