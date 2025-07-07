import { useEffect, useState } from "react";
import { fakeApi, Product } from "@/lib/fakeApi";
import { cn } from "@/lib/utils";
import {
  Package,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const getStatusInfo = (product: Product) => {
  const percentage = (product.quantity / product.threshold) * 100;

  if (product.quantity === 0) {
    return {
      status: "out" as const,
      color: "text-red-600 bg-red-50 border-red-200",
      icon: AlertTriangle,
      badge: "Out of Stock",
    };
  } else if (product.quantity <= product.threshold) {
    return {
      status: "low" as const,
      color: "text-orange-600 bg-orange-50 border-orange-200",
      icon: TrendingDown,
      badge: "Low Stock",
    };
  } else if (percentage <= 150) {
    return {
      status: "medium" as const,
      color: "text-yellow-600 bg-yellow-50 border-yellow-200",
      icon: Package,
      badge: "Medium Stock",
    };
  } else {
    return {
      status: "good" as const,
      color: "text-green-600 bg-green-50 border-green-200",
      icon: CheckCircle,
      badge: "Good Stock",
    };
  }
};

export default function InventoryList() {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatedItems, setUpdatedItems] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let prevInventory: Product[] = [];

    const fetchInventory = async () => {
      try {
        const newInventory = await fakeApi.getInventory();

        // Track which items were updated
        const updated = new Set<string>();
        if (prevInventory.length > 0) {
          newInventory.forEach((item, index) => {
            const prevItem = prevInventory[index];
            if (prevItem && prevItem.quantity !== item.quantity) {
              updated.add(item.id);
            }
          });
        }

        setUpdatedItems(updated);
        setInventory(newInventory);
        prevInventory = [...newInventory];

        // Clear update highlights after 2 seconds
        if (updated.size > 0) {
          setTimeout(() => setUpdatedItems(new Set()), 2000);
        }
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch inventory",
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchInventory();

    // Poll for inventory updates every 2 seconds
    const interval = setInterval(fetchInventory, 2000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <Package className="h-5 w-5 text-destructive" />
          <h2 className="text-lg font-semibold">Inventory Error</h2>
        </div>
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Inventory</h2>
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-auto" />
        </div>
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between p-4 rounded-xl border">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-muted rounded-xl"></div>
                  <div>
                    <div className="h-4 bg-muted rounded w-24 mb-1"></div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                  </div>
                </div>
                <div className="h-6 bg-muted rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Inventory</h2>
        </div>
        <div className="text-sm text-muted-foreground">
          {inventory.length} items
        </div>
      </div>

      <div className="space-y-3">
        {inventory.map((product) => {
          const statusInfo = getStatusInfo(product);
          const Icon = statusInfo.icon;
          const isUpdated = updatedItems.has(product.id);

          return (
            <div
              key={product.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
                statusInfo.color,
                isUpdated && "ring-2 ring-primary/50 shadow-lg scale-[1.02]",
              )}
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm opacity-75">{product.category}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg">{product.quantity}</span>
                  <span className="text-sm opacity-75">{product.unit}</span>
                  {isUpdated && (
                    <TrendingDown className="h-4 w-4 text-red-500 animate-bounce" />
                  )}
                </div>
                <div className="text-xs opacity-75 mt-1">
                  Threshold: {product.threshold} {product.unit}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-4 rounded-xl bg-muted/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Live Updates</span>
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-green-600 font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
