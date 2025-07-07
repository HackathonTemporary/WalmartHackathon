export interface Product {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  threshold: number;
}

export interface AITip {
  id: string;
  type: "restock" | "swap" | "forecast" | "alert";
  message: string;
  product?: string;
  urgency: "low" | "medium" | "high";
  timestamp: Date;
}

export interface SwapOffer {
  id: string;
  fromNode: string;
  product: string;
  quantity: number;
  unit: string;
  distance: string;
  estimatedTime: string;
  available: boolean;
}

export interface NodeInfo {
  id: string;
  name: string;
  type: string;
  location: string;
  assigned: boolean;
}

// Initial inventory data
const initialInventory: Product[] = [
  {
    id: "1",
    name: "Basmati Rice",
    quantity: 45,
    unit: "kg",
    category: "Grains",
    threshold: 20,
  },
  {
    id: "2",
    name: "Sugar",
    quantity: 25,
    unit: "kg",
    category: "Sweeteners",
    threshold: 15,
  },
  {
    id: "3",
    name: "Wheat Flour",
    quantity: 60,
    unit: "kg",
    category: "Grains",
    threshold: 25,
  },
  {
    id: "4",
    name: "Cooking Oil",
    quantity: 12,
    unit: "liters",
    category: "Oils",
    threshold: 8,
  },
  {
    id: "5",
    name: "Dal (Lentils)",
    quantity: 18,
    unit: "kg",
    category: "Pulses",
    threshold: 10,
  },
  {
    id: "6",
    name: "Tea Powder",
    quantity: 8,
    unit: "kg",
    category: "Beverages",
    threshold: 5,
  },
  {
    id: "7",
    name: "Salt",
    quantity: 15,
    unit: "kg",
    category: "Condiments",
    threshold: 8,
  },
  {
    id: "8",
    name: "Onions",
    quantity: 22,
    unit: "kg",
    category: "Vegetables",
    threshold: 12,
  },
];

// AI Tips pool
const aiTipsPool: Omit<AITip, "id" | "timestamp">[] = [
  {
    type: "restock",
    message: "Replenish Rice - demand spike predicted",
    product: "Basmati Rice",
    urgency: "high",
  },
  {
    type: "swap",
    message: "Swap 30 units of Sugar with Node Charlie",
    product: "Sugar",
    urgency: "medium",
  },
  {
    type: "forecast",
    message: "High demand for Cooking Oil expected tomorrow",
    product: "Cooking Oil",
    urgency: "medium",
  },
  {
    type: "alert",
    message: "Low stock alert: Tea Powder below threshold",
    product: "Tea Powder",
    urgency: "high",
  },
  {
    type: "forecast",
    message: "Festival season: increase Wheat Flour stock",
    product: "Wheat Flour",
    urgency: "low",
  },
  {
    type: "swap",
    message: "Node Beta has excess Dal - request swap?",
    product: "Dal (Lentils)",
    urgency: "low",
  },
  {
    type: "alert",
    message: "Onion prices rising - stock up now",
    product: "Onions",
    urgency: "medium",
  },
  {
    type: "forecast",
    message: "Rain predicted - Salt demand may increase",
    product: "Salt",
    urgency: "low",
  },
];

// Swap offers data
const swapOffers: SwapOffer[] = [
  {
    id: "1",
    fromNode: "Node Charlie",
    product: "Sugar 2kg",
    quantity: 30,
    unit: "units",
    distance: "1.2 km",
    estimatedTime: "15 mins",
    available: true,
  },
  {
    id: "2",
    fromNode: "Node Beta",
    product: "Dal (Lentils)",
    quantity: 15,
    unit: "kg",
    distance: "0.8 km",
    estimatedTime: "12 mins",
    available: true,
  },
  {
    id: "3",
    fromNode: "Node Echo",
    product: "Cooking Oil",
    quantity: 8,
    unit: "liters",
    distance: "2.1 km",
    estimatedTime: "25 mins",
    available: true,
  },
  {
    id: "4",
    fromNode: "Node Alpha",
    product: "Tea Powder",
    quantity: 5,
    unit: "kg",
    distance: "1.5 km",
    estimatedTime: "18 mins",
    available: false,
  },
];

// Additional swap offers that appear later
const additionalSwapOffers: SwapOffer[] = [
  {
    id: "5",
    fromNode: "Node Gamma",
    product: "Wheat Flour",
    quantity: 20,
    unit: "kg",
    distance: "1.8 km",
    estimatedTime: "22 mins",
    available: true,
  },
  {
    id: "6",
    fromNode: "Node Delta",
    product: "Basmati Rice",
    quantity: 25,
    unit: "kg",
    distance: "0.9 km",
    estimatedTime: "14 mins",
    available: true,
  },
];

// Simulated state
let currentInventory = [...initialInventory];
let currentAITips: AITip[] = [];
let currentSwapOffers = [...swapOffers];
let aiTipIndex = 0;
let tipIdCounter = 0;
let lastTipType: string | null = null;

// Fake API functions
export const fakeApi = {
  // Get current inventory
  getInventory: (): Promise<Product[]> => {
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => resolve([...currentInventory]), 100);
      } catch (error) {
        reject(error);
      }
    });
  },

  // Get AI tips
  getAITips: (): Promise<AITip[]> => {
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => resolve([...currentAITips]), 100);
      } catch (error) {
        reject(error);
      }
    });
  },

  // Get swap offers
  getSwapOffers: (): Promise<SwapOffer[]> => {
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => resolve([...currentSwapOffers]), 100);
      } catch (error) {
        reject(error);
      }
    });
  },

  // Simulate inventory decrease (sales)
  simulateInventoryDecrease: () => {
    try {
      if (currentInventory.length === 0) return;
      const randomProduct =
        currentInventory[Math.floor(Math.random() * currentInventory.length)];
      if (randomProduct && randomProduct.quantity > 0) {
        const decrease = Math.floor(Math.random() * 3) + 1; // 1-3 units
        randomProduct.quantity = Math.max(0, randomProduct.quantity - decrease);
      }
    } catch (error) {
      console.error("Error in simulateInventoryDecrease:", error);
    }
  },

  // Add new AI tip
  addAITip: () => {
    try {
      if (aiTipsPool.length === 0) return;

      // Prevent consecutive duplicates
      let tipTemplate;
      let attempts = 0;
      const maxAttempts = aiTipsPool.length * 2;

      do {
        tipTemplate = aiTipsPool[aiTipIndex % aiTipsPool.length];
        aiTipIndex++;
        attempts++;
      } while (
        attempts < maxAttempts &&
        lastTipType === `${tipTemplate.type}-${tipTemplate.message}` &&
        aiTipsPool.length > 1
      );

      tipIdCounter++;
      const newTip: AITip = {
        ...tipTemplate,
        id: `tip-${tipIdCounter}-${Date.now()}`,
        timestamp: new Date(),
      };

      lastTipType = `${tipTemplate.type}-${tipTemplate.message}`;
      currentAITips = [newTip, ...currentAITips.slice(0, 4)]; // Keep only 5 most recent
    } catch (error) {
      console.error("Error in addAITip:", error);
    }
  },

  // Add additional swap offers (simulated after delay)
  addAdditionalSwapOffers: () => {
    currentSwapOffers = [...currentSwapOffers, ...additionalSwapOffers];
  },

  // Request swap
  requestSwap: (swapId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const swap = currentSwapOffers.find((s) => s.id === swapId);
        if (swap) {
          swap.available = false;
        }
        resolve(true);
      }, 500);
    });
  },

  // Onboarding data
  getNodeAssignment: (): Promise<NodeInfo> => {
    const nodes = ["Alpha", "Beta", "Gamma", "Delta", "Echo"];
    const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            id: randomNode.toLowerCase(),
            name: `Node ${randomNode}`,
            type: "Micro-warehouse",
            location: "Mumbai, Maharashtra",
            assigned: true,
          }),
        1000,
      );
    });
  },
};

// Simulation state
let simulationStarted = false;
let simulationIntervals: NodeJS.Timeout[] = [];

// Auto-simulation functions (start timers)
export const startSimulation = () => {
  // Prevent multiple simulations
  if (simulationStarted) return;
  simulationStarted = true;

  // Add initial AI tip
  fakeApi.addAITip();

  // Inventory decrease every 5 seconds
  const inventoryInterval = setInterval(() => {
    fakeApi.simulateInventoryDecrease();
  }, 5000);
  simulationIntervals.push(inventoryInterval);

  // AI tips every 8 seconds
  const tipsInterval = setInterval(() => {
    fakeApi.addAITip();
  }, 8000);
  simulationIntervals.push(tipsInterval);

  // Add additional swap offers after 12 seconds
  const swapTimeout = setTimeout(() => {
    fakeApi.addAdditionalSwapOffers();
  }, 12000);
  simulationIntervals.push(swapTimeout);
};

// Stop simulation (for cleanup)
export const stopSimulation = () => {
  simulationStarted = false;
  simulationIntervals.forEach((interval) => clearInterval(interval));
  simulationIntervals = [];
};
