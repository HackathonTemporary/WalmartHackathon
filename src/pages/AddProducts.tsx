import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Package,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NewProduct {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  category: string;
  threshold: string;
}

const categories = [
  "Grains",
  "Sweeteners",
  "Oils",
  "Pulses",
  "Beverages",
  "Condiments",
  "Vegetables",
  "Dairy",
  "Spices",
  "Snacks",
];

const units = ["kg", "liters", "units", "packets", "bags", "boxes"];

export default function AddProducts() {
  const [products, setProducts] = useState<NewProduct[]>([]);
  const [currentProduct, setCurrentProduct] = useState<NewProduct>({
    id: "",
    name: "",
    quantity: "",
    unit: "kg",
    category: "Grains",
    threshold: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const addProduct = () => {
    if (
      !currentProduct.name ||
      !currentProduct.quantity ||
      !currentProduct.threshold
    ) {
      return;
    }

    const newProduct = {
      ...currentProduct,
      id: Date.now().toString(),
    };

    setProducts([...products, newProduct]);
    setCurrentProduct({
      id: "",
      name: "",
      quantity: "",
      unit: "kg",
      category: "Grains",
      threshold: "",
    });
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const saveInventory = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Layout>
      <div className="space-y-6 pb-20 md:pb-6">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 p-6 border">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Add Your Products
              </h1>
              <p className="text-muted-foreground">
                Setup your initial inventory for the AI network
              </p>
            </div>
          </div>
        </div>

        {/* Add Product Form */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Add New Product</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                placeholder="e.g., Basmati Rice"
                value={currentProduct.name}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, name: e.target.value })
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="quantity">Initial Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="50"
                value={currentProduct.quantity}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    quantity: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="unit">Unit</Label>
              <select
                id="unit"
                value={currentProduct.unit}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, unit: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={currentProduct.category}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    category: e.target.value,
                  })
                }
                className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="threshold">Low Stock Alert</Label>
              <Input
                id="threshold"
                type="number"
                placeholder="20"
                value={currentProduct.threshold}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    threshold: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={addProduct}
                disabled={
                  !currentProduct.name ||
                  !currentProduct.quantity ||
                  !currentProduct.threshold
                }
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>
        </div>

        {/* Products List */}
        {products.length > 0 && (
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                Your Products ({products.length})
              </h2>
              <Button
                onClick={saveInventory}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Inventory</span>
              </Button>
            </div>

            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 rounded-xl border bg-muted/30"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {product.category} • Alert at {product.threshold}{" "}
                        {product.unit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="font-bold text-lg">
                        {product.quantity}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">
                        {product.unit}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeProduct(product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No products added yet
            </h3>
            <p className="text-muted-foreground">
              Add your first product using the form above to get started
            </p>
          </div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20">
            <div className="bg-white rounded-2xl p-6 shadow-xl border max-w-sm mx-4 animate-in fade-in-0 slide-in-from-bottom-4">
              <div className="flex items-center space-x-3 mb-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">
                    Inventory Saved!
                  </h3>
                  <p className="text-sm text-green-600">
                    Your products have been added to the network
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                AI will now start analyzing your inventory patterns and provide
                smart recommendations.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
