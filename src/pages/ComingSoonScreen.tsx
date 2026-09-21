import React from 'react';
import { ServiceUnavailableView } from '../components/ServiceUnavailableView';

interface ComingSoonScreenProps {
  userLocationAddress?: string;
  onSearchNewAddress?: () => void;
}

export const ComingSoonScreen: React.FC<ComingSoonScreenProps> = ({ onSearchNewAddress }) => {
  return <ServiceUnavailableView onSearchNewAddress={onSearchNewAddress} />;
};
