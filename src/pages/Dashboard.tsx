import { useEffect } from "react";
import Layout from "@/components/Layout";
import InventoryList from "@/components/InventoryList";
import AITipsCarousel from "@/components/AITipsCarousel";
import { startSimulation, stopSimulation } from "@/lib/fakeApi";
import { BarChart3, Users, TrendingUp, Zap } from "lucide-react";

export default function Dashboard() {
  useEffect(() => {
    // Start the simulation when dashboard loads
    startSimulation();

    // Cleanup on unmount
    return () => {
      stopSimulation();
    };
  }, []);

  return (
    <Layout>
      <div className="space-y-6 pb-20 md:pb-6">
        {/* Hero Section */}
        <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 p-6 border">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Welcome to Node Delta
              </h1>
              <p className="text-muted-foreground mb-4">
                AI-Powered Hyperlocal Retail Network
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/50">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Live Analytics</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/50">
                  <Users className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-medium">5 Nodes</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/50">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">+12% Sales</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/50">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">AI Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inventory Section */}
          <div className="lg:col-span-2">
            <InventoryList />
          </div>

          {/* AI Tips Section */}
          <div className="lg:col-span-1">
            <AITipsCarousel />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Sales</p>
                <p className="text-2xl font-bold text-foreground">₹12,450</p>
                <p className="text-sm text-green-600 font-medium">+8.2%</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Swaps</p>
                <p className="text-2xl font-bold text-foreground">4</p>
                <p className="text-sm text-blue-600 font-medium">2 pending</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Network Health</p>
                <p className="text-2xl font-bold text-foreground">98%</p>
                <p className="text-sm text-green-600 font-medium">Excellent</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
