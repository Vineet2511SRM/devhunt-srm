import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

const StarRating = ({ value = 0, onChange, readOnly = false, size = 20 }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      {stars.map((star) => {
        const isFilled = (hoverValue || value) >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange && onChange(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
            style={{
              background: 'none',
              border: 'none',
              cursor: readOnly ? 'default' : 'pointer',
              color: isFilled ? 'var(--color-star)' : 'var(--color-border-hover)',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              transition: 'color var(--transition-fast)',
            }}
          >
            <FiStar
              size={size}
              style={{
                fill: isFilled ? 'var(--color-star)' : 'transparent',
              }}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
