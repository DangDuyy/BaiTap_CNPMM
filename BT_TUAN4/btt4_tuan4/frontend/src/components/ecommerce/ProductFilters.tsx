import React from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { categories } from '@/lib/products';

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 border-input hover:border-input-hover focus:border-primary transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filters.onSale ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterChange('onSale', !filters.onSale)}
          className="flex-shrink-0"
        >
          On Sale
        </Button>
        <Button
          variant={filters.inStock ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterChange('inStock', !filters.inStock)}
          className="flex-shrink-0"
        >
          In Stock
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-shrink-0"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <Card className="bg-gradient-card border-0 shadow-md animate-scale-in">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg">
              <Filter className="h-5 w-5 mr-2 text-primary" />
              Advanced Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={filters.category || 'All Categories'}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Price Range: ${filters.priceRange?.[0] || 0} - ${filters.priceRange?.[1] || 2000}
              </label>
              <Slider
                value={filters.priceRange || [0, 2000]}
                onValueChange={(value) => handleFilterChange('priceRange', value)}
                max={2000}
                step={50}
                className="w-full"
              />
            </div>

            {/* Minimum Rating */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Rating</label>
              <Select
                value={filters.minRating?.toString() || 'any'}
                onValueChange={(value) => handleFilterChange('minRating', value === 'any' ? undefined : parseFloat(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any rating</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort by</label>
                <Select
                  value={filters.sortBy || 'name'}
                  onValueChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="views">Popularity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Order</label>
                <Select
                  value={filters.sortOrder || 'asc'}
                  onValueChange={(value) => handleFilterChange('sortOrder', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                onFiltersChange({});
                onSearchChange('');
              }}
              className="w-full"
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};