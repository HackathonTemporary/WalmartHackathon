import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import SwapCard from "@/components/SwapCard";
import { fakeApi, SwapOffer } from "@/lib/fakeApi";
import {
  Repeat,
  Search,
  Filter,
  MapPin,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SwapMarketplace() {
  const [swapOffers, setSwapOffers] = useState<SwapOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    const fetchSwapOffers = async () => {
      try {
        const offers = await fakeApi.getSwapOffers();
        setSwapOffers(offers);
      } catch (error) {
        console.error("Error fetching swap offers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSwapOffers();

    // Poll for new offers every 5 seconds
    const interval = setInterval(fetchSwapOffers, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredOffers = swapOffers.filter((offer) => {
    const matchesSearch = offer.product
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesAvailability = showAvailableOnly ? offer.available : true;
    return matchesSearch && matchesAvailability;
  });

  const handleRequestSent = () => {
    setRequestCount((prev) => prev + 1);
  };

  const refreshOffers = async () => {
    setIsLoading(true);
    try {
      const offers = await fakeApi.getSwapOffers();
      setSwapOffers(offers);
    } catch (error) {
      console.error("Error refreshing swap offers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 pb-20 md:pb-6">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-br from-secondary/10 via-secondary/5 to-primary/10 p-6 border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                <Repeat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Swap Marketplace
                </h1>
                <p className="text-muted-foreground">
                  Exchange inventory with nearby nodes
                </p>
              </div>
            </div>
            <Button
              onClick={refreshOffers}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/50">
              <MapPin className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">
                {filteredOffers.length} Offers Nearby
              </span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/50">
              <Repeat className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {requestCount} Requests Sent
              </span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/50">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">Live Updates Active</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showAvailableOnly ? "default" : "outline"}
            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Available Only</span>
          </Button>
        </div>

        {/* Offers Grid */}
        {isLoading && swapOffers.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-muted rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-20 bg-muted rounded-xl"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <SwapCard
                key={offer.id}
                offer={offer}
                onRequestSent={handleRequestSent}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Repeat className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No swap offers found
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm
                ? "Try adjusting your search terms"
                : "New offers will appear here as they become available"}
            </p>
            <Button onClick={refreshOffers} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Offers
            </Button>
          </div>
        )}

        {/* Info Banner */}
        <div className="rounded-2xl border bg-gradient-to-r from-blue-50 to-green-50 p-6">
          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Repeat className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                How Swaps Work
              </h3>
              <p className="text-sm text-muted-foreground">
                Request inventory from nearby nodes when you're running low. AI
                recommendations help optimize your requests for maximum
                efficiency and cost savings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
