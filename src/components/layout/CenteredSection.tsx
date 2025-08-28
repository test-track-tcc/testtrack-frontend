import React from 'react';

interface CenteredSectionProps {
  children: React.ReactNode;
}

export default function CenteredSection({ children }: CenteredSectionProps) {
  return (
    <div className="centered-container">
      <div className="centered-section">
        {children}
      </div>
    </div>
  );
}
