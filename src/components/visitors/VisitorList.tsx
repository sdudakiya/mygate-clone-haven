import React from 'react';
import { VisitorCard } from './VisitorCard';
import { useUserRole } from '@/hooks/use-user-role';

interface VisitorListProps {
  visitors: any[];
  onVerify: () => void;
}

export const VisitorList: React.FC<VisitorListProps> = ({ visitors, onVerify }) => {
  const { isSecurity } = useUserRole();

  return (
    <div className="divide-y">
      {visitors.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No visitors found
        </div>
      ) : (
        visitors.map((visitor) => (
          <VisitorCard
            key={visitor.id}
            visitor={visitor}
            onVerify={onVerify}
            isSecurity={isSecurity}
          />
        ))
      )}
    </div>
  );
};