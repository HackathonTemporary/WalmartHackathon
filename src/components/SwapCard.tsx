import { useState } from "react";
import { SwapOffer, fakeApi } from "@/lib/fakeApi";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Clock,
  Package,
  ArrowRightLeft,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SwapCardProps {
  offer: SwapOffer;
  onRequestSent?: () => void;
}

export default function SwapCard({ offer, onRequestSent }: SwapCardProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [isRequested, setIsRequested] = useState(!offer.available);

  const handleRequest = async () => {
    if (isRequested || !offer.available) return;

    setIsRequesting(true);
    try {
      await fakeApi.requestSwap(offer.id);
      setIsRequested(true);
      onRequestSent?.();
    } catch (error) {
      console.error("Error requesting swap:", error);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md",
        !offer.available && "opacity-75 bg-muted/30",
      )}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {offer.fromNode}
              </h3>
              <p className="text-sm text-muted-foreground">Micro-warehouse</p>
            </div>
          </div>
          {!offer.available && (
            <div className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
              Unavailable
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="rounded-xl bg-muted/30 p-4">
          <div className="flex items-center space-x-3">
            <Package className="h-5 w-5 text-secondary" />
            <div className="flex-1">
              <p className="font-medium text-foreground">{offer.product}</p>
              <p className="text-sm text-muted-foreground">
                {offer.quantity} {offer.unit} available
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-secondary">
                {offer.quantity}
              </p>
              <p className="text-xs text-muted-foreground">{offer.unit}</p>
            </div>
          </div>
        </div>

        {/* Location & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{offer.distance}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{offer.estimatedTime}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleRequest}
          disabled={isRequesting || isRequested || !offer.available}
          className={cn(
            "w-full transition-all duration-300",
            isRequested
              ? "bg-green-100 text-green-700 hover:bg-green-100"
              : "bg-primary hover:bg-primary/90",
          )}
          size="lg"
        >
          {isRequesting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Requesting...
            </>
          ) : isRequested ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Request Sent
            </>
          ) : (
            <>
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Request Swap
            </>
          )}
        </Button>

        {isRequested && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Your request has been sent to {offer.fromNode}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
