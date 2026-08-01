import React from 'react';
import { FiInbox, FiPlus, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = FiInbox,
  title = 'No items found',
  description = 'There are no items to display at this time.',
  actionText,
  actionLink,
  onActionClick,
  style = {},
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-2xl) var(--spacing-md)',
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px border-dashed var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        textAlign: 'center',
        margin: 'var(--spacing-lg) 0',
        ...style,
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(223, 225, 4, 0.08)',
          color: 'var(--color-accent, #dfe104)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.75rem',
          marginBottom: 'var(--spacing-md)',
        }}
      >
        <Icon />
      </div>
      <h3
        style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: '700',
          marginBottom: 'var(--spacing-xs)',
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-sm)',
          maxWidth: '400px',
          lineHeight: '1.5',
          marginBottom: actionText ? 'var(--spacing-lg)' : 0,
        }}
      >
        {description}
      </p>

      {actionText && (
        actionLink ? (
          <Link
            to={actionLink}
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
            }}
          >
            <FiPlus /> {actionText}
          </Link>
        ) : onActionClick ? (
          <button
            onClick={onActionClick}
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FiSearch /> {actionText}
          </button>
        ) : null
      )}
    </div>
  );
};

export default EmptyState;
