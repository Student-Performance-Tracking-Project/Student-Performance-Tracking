import type { ReactNode } from 'react';
import './ChartCard.css';

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

const ChartCard = ({ title, children }: ChartCardProps) => {
  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-content">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;