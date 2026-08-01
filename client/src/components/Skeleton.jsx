import React from 'react';

/**
 * Base Skeleton Pulse block
 */
export const SkeletonBlock = ({ width = '100%', height = '16px', borderRadius = 'var(--radius-md)', style = {} }) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--color-bg-tertiary, #24292f)',
        opacity: 0.7,
        animation: 'skeletonPulse 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  );
};

/**
 * Skeleton Loader for ProjectCard
 */
export const ProjectCardSkeleton = () => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
      }}
    >
      <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
        <SkeletonBlock width="48px" height="48px" borderRadius="var(--radius-md)" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SkeletonBlock width="60%" height="20px" />
          <SkeletonBlock width="40%" height="14px" />
        </div>
      </div>
      <SkeletonBlock width="100%" height="40px" />
      <div style={{ display: 'flex', gap: '8px' }}>
        <SkeletonBlock width="60px" height="24px" borderRadius="12px" />
        <SkeletonBlock width="70px" height="24px" borderRadius="12px" />
        <SkeletonBlock width="50px" height="24px" borderRadius="12px" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px' }}>
        <SkeletonBlock width="100px" height="16px" />
        <SkeletonBlock width="50px" height="32px" borderRadius="var(--radius-md)" />
      </div>
    </div>
  );
};

/**
 * Skeleton Loader for Review Card
 */
export const ReviewSkeleton = () => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--spacing-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <SkeletonBlock width="40px" height="40px" borderRadius="50%" />
        <div style={{ flex: 1 }}>
          <SkeletonBlock width="120px" height="16px" style={{ marginBottom: '4px' }} />
          <SkeletonBlock width="80px" height="12px" />
        </div>
        <SkeletonBlock width="90px" height="16px" />
      </div>
      <SkeletonBlock width="100%" height="48px" />
    </div>
  );
};

/**
 * Skeleton Loader for Profile Page header & stats
 */
export const ProfileSkeleton = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <div
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--spacing-2xl)',
          display: 'flex',
          gap: 'var(--spacing-xl)',
          alignItems: 'center',
        }}
      >
        <SkeletonBlock width="110px" height="110px" borderRadius="50%" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <SkeletonBlock width="200px" height="28px" />
          <SkeletonBlock width="300px" height="16px" />
          <SkeletonBlock width="150px" height="14px" />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-md)' }}>
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </div>
    </div>
  );
};

/**
 * Full Page Loading Spinner Fallback for Suspense
 */
export const PageLoadingSpinner = () => {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacing-md)',
        color: 'var(--color-text-secondary)',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-accent-primary, #6366f1)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: '500' }}>Loading DevHunt SRM...</span>
    </div>
  );
};

export default SkeletonBlock;
