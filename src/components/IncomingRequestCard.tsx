import { useState } from "react";
import { IncomingSwapRequest, fakeApi } from "@/lib/fakeApi";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Clock,
  Package,
  ArrowRightLeft,
  Check,
  X,
  Loader2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface IncomingRequestCardProps {
  request: IncomingSwapRequest;
  onResponse?: () => void;
}

export default function IncomingRequestCard({
  request,
  onResponse,
}: IncomingRequestCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(request.status);

  const handleAccept = async () => {
    if (currentStatus !== "pending") return;

    setIsProcessing(true);
    try {
      await fakeApi.acceptSwapRequest(request.id);
      setCurrentStatus("accepted");
      onResponse?.();
    } catch (error) {
      console.error("Error accepting swap request:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (currentStatus !== "pending") return;

    setIsProcessing(true);
    try {
      await fakeApi.declineSwapRequest(request.id);
      setCurrentStatus("declined");
      onResponse?.();
    } catch (error) {
      console.error("Error declining swap request:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = () => {
    switch (currentStatus) {
      case "accepted":
        return "border-green-200 bg-green-50";
      case "declined":
        return "border-red-200 bg-red-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  const getStatusBadge = () => {
    switch (currentStatus) {
      case "accepted":
        return (
          <div className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            ✓ Accepted
          </div>
        );
      case "declined":
        return (
          <div className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
            ✗ Declined
          </div>
        );
      default:
        return (
          <div className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
            ⏳ Pending
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300",
        getStatusColor(),
        currentStatus !== "pending" && "opacity-75",
      )}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {request.fromNode}
              </h3>
              <p className="text-sm text-muted-foreground">
                Incoming swap request
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Trade Details */}
        <div className="rounded-xl bg-white/70 p-4 border">
          <div className="flex items-center justify-between">
            {/* What they want */}
            <div className="flex-1 text-center">
              <p className="text-xs text-muted-foreground mb-1">They want</p>
              <div className="flex items-center justify-center space-x-2">
                <Package className="h-4 w-4 text-red-600" />
                <div>
                  <p className="font-medium text-sm">
                    {request.requestingProduct}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {request.requestedQuantity} {request.unit}
                  </p>
                </div>
              </div>
            </div>

            {/* Swap arrow */}
            <div className="flex-shrink-0 px-3">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
            </div>

            {/* What they offer */}
            <div className="flex-1 text-center">
              <p className="text-xs text-muted-foreground mb-1">They offer</p>
              <div className="flex items-center justify-center space-x-2">
                <Package className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium text-sm">
                    {request.offeringProduct}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {request.offeredQuantity} {request.unit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{request.distance}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {request.estimatedTime}
            </span>
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-xs text-muted-foreground">
          Received{" "}
          {request.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          •{" "}
          {Math.floor((Date.now() - request.timestamp.getTime()) / (1000 * 60))}{" "}
          min ago
        </div>

        {/* Action Buttons */}
        {currentStatus === "pending" && (
          <div className="flex space-x-3">
            <Button
              onClick={handleAccept}
              disabled={isProcessing}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Accept Swap
                </>
              )}
            </Button>
            <Button
              onClick={handleDecline}
              disabled={isProcessing}
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Decline
                </>
              )}
            </Button>
          </div>
        )}

        {/* Result Messages */}
        {currentStatus === "accepted" && (
          <div className="text-center p-3 bg-green-100 rounded-lg">
            <p className="text-sm font-medium text-green-800">
              🎉 Swap accepted! Coordinate with {request.fromNode} for the
              exchange.
            </p>
          </div>
        )}

        {currentStatus === "declined" && (
          <div className="text-center p-3 bg-red-100 rounded-lg">
            <p className="text-sm font-medium text-red-800">
              Request declined. {request.fromNode} has been notified.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
