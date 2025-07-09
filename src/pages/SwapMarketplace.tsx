import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import SwapCard from "@/components/SwapCard";
import IncomingRequestCard from "@/components/IncomingRequestCard";
import { fakeApi, SwapOffer, IncomingSwapRequest } from "@/lib/fakeApi";
import {
  Repeat,
  Search,
  Filter,
  MapPin,
  Loader2,
  RefreshCw,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SwapMarketplace() {
  const [swapOffers, setSwapOffers] = useState<SwapOffer[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<
    IncomingSwapRequest[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"offers" | "requests">("offers");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offers, requests] = await Promise.all([
          fakeApi.getSwapOffers(),
          fakeApi.getIncomingRequests(),
        ]);
        setSwapOffers(offers);
        setIncomingRequests(requests);
      } catch (error) {
        console.error("Error fetching swap data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Poll for new data every 5 seconds
    const interval = setInterval(fetchData, 5000);
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

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [offers, requests] = await Promise.all([
        fakeApi.getSwapOffers(),
        fakeApi.getIncomingRequests(),
      ]);
      setSwapOffers(offers);
      setIncomingRequests(requests);
    } catch (error) {
      console.error("Error refreshing swap data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestResponse = () => {
    setRequestCount((prev) => prev + 1);
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
              onClick={refreshData}
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

        {/* Tab Navigation */}
        <div className="flex space-x-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setActiveTab("offers")}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "offers"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Repeat className="h-4 w-4" />
              <span>Available Offers</span>
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                {filteredOffers.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "requests"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Inbox className="h-4 w-4" />
              <span>Incoming Requests</span>
              <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">
                {incomingRequests.filter((r) => r.status === "pending").length}
              </span>
            </div>
          </button>
        </div>

        {/* Filters */}
        {activeTab === "offers" && (
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
        )}

        {/* Content based on active tab */}
        {activeTab === "offers" ? (
          // Offers Content
          <>
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
                <Button onClick={refreshData} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Offers
                </Button>
              </div>
            )}
          </>
        ) : (
          // Incoming Requests Content
          <>
            {isLoading && incomingRequests.length === 0 ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="rounded-2xl border bg-card p-6 shadow-sm">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-muted rounded-xl"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-muted rounded w-1/3"></div>
                          </div>
                        </div>
                        <div className="h-20 bg-muted rounded-xl"></div>
                        <div className="flex gap-3">
                          <div className="h-10 bg-muted rounded flex-1"></div>
                          <div className="h-10 bg-muted rounded flex-1"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : incomingRequests.length > 0 ? (
              <div className="space-y-4">
                {incomingRequests.map((request) => (
                  <IncomingRequestCard
                    key={request.id}
                    request={request}
                    onResponse={handleRequestResponse}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Inbox className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No incoming requests
                </h3>
                <p className="text-muted-foreground mb-6">
                  New swap requests from other nodes will appear here
                </p>
                <Button onClick={refreshData} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Requests
                </Button>
              </div>
            )}
          </>
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
