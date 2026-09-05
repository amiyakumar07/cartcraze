import React from 'react';
import { Hourglass, Gavel, RefreshCw, ShieldCheck, Bike, User } from 'lucide-react';
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import type { RiderApprovalData } from "../types";

interface Props {
  riderData: RiderApprovalData;
  onRefreshStatus?: () => void;
}

export const RiderPendingApprovalScreen: React.FC<Props> = ({ riderData, onRefreshStatus }) => {
  const isRejected = riderData?.status === 'REJECTED';

  return (
    <div className="min-h-full bg-fleet-950 text-fleet-50 flex flex-col items-center justify-center p-6 animate-fade-in">
      <Card variant="elevated" className="w-full max-w-sm text-center py-10 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className={cn(
          "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10",
          isRejected ? "bg-rose-500/10" : "bg-amber-500/10"
        )} />

        <div className="relative">
          <div className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 border-2 shadow-xl",
            isRejected 
              ? "bg-rose-500/10 border-rose-500/30 text-rose-400" 
              : "bg-amber-500/10 border-amber-500/30 text-amber-400"
          )}>
            {isRejected ? <Gavel className="w-10 h-10" /> : <Hourglass className="w-10 h-10 animate-pulse" />}
          </div>

          <h1 className="text-xl font-display font-bold text-white mb-2">
            {isRejected ? 'Application Declined' : 'Verification in Progress'}
          </h1>
          <p className="text-sm text-fleet-500 leading-relaxed mb-6">
            {isRejected 
              ? 'Your application was declined. Contact admin for review.' 
              : 'Your documents are under review by our team. This usually takes 24-48 hours.'}
          </p>

          <Card variant="default" className="text-left mb-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-fleet-500">
                  <User className="w-4 h-4" />
                  <span className="text-xs font-bold">Name</span>
                </div>
                <span className="text-sm font-bold text-fleet-100">{riderData?.name || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-fleet-500">
                  <Bike className="w-4 h-4" />
                  <span className="text-xs font-bold">Vehicle</span>
                </div>
                <span className="text-sm font-bold text-fleet-100">{riderData?.vehicleNumber || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-fleet-500">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-bold">Status</span>
                </div>
                <Badge variant={isRejected ? 'danger' : 'warning'} size="sm">
                  {riderData?.status || 'PENDING'}
                </Badge>
              </div>
            </div>
          </Card>

          {onRefreshStatus && (
            <Button 
              variant={isRejected ? 'danger' : 'secondary'} 
              fullWidth 
              onClick={onRefreshStatus}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Check Status
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

import { cn } from "../utils/cn";
