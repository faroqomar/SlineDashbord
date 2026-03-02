"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, Filter, X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FilterOption {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "daterange";
  options?: { value: string; label: string }[];
}

interface FilterPanelProps {
  filters: FilterOption[];
  onFilterChange: (filters: Record<string, any>) => void;
  onSearch: (query: string) => void;
  searchPlaceholder?: string;
}

export function FilterPanel({
  filters,
  onFilterChange,
  onSearch,
  searchPlaceholder = "Search...",
}: FilterPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newValues = { ...filterValues, [key]: value };
    setFilterValues(newValues);
    onFilterChange(newValues);
  };

  const clearFilters = () => {
    setFilterValues({});
    onFilterChange({});
  };

  const activeFilterCount = Object.values(filterValues).filter(Boolean).length;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 bg-background/50"
        />
      </div>

      {/* Filter Toggle */}
      <Popover open={showFilters} onOpenChange={setShowFilters}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 bg-background/50">
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] h-5 min-w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filters</h4>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </Button>
              )}
            </div>

            {filters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <Label className="text-sm font-normal text-muted-foreground">{filter.label}</Label>
                {filter.type === "select" && filter.options && (
                  <Select
                    value={filterValues[filter.key] || ""}
                    onValueChange={(value) => handleFilterChange(filter.key, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {filter.type === "text" && (
                  <Input
                    value={filterValues[filter.key] || ""}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    placeholder={`Enter ${filter.label.toLowerCase()}`}
                  />
                )}
                {filter.type === "date" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filterValues[filter.key] && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filterValues[filter.key]
                          ? format(filterValues[filter.key], "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filterValues[filter.key]}
                        onSelect={(date) => handleFilterChange(filter.key, date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="hidden lg:flex items-center gap-2 flex-wrap">
          {Object.entries(filterValues).map(
            ([key, value]) =>
              value && (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted/50 border rounded-md"
                >
                  <span className="text-muted-foreground">{filters.find((f) => f.key === key)?.label}:</span> 
                  <span className="font-medium">{value instanceof Date ? format(value, 'MMM d') : value.toString()}</span>
                  <button
                    onClick={() => handleFilterChange(key, undefined)}
                    className="ml-1 hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )
          )}
        </div>
      )}
    </div>
  );
}
