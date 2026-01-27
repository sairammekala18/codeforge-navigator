import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { PROBLEM_TAGS } from "@/types/codeforces";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TopicFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  currentRating: number;
  onRatingChange: (rating: number | null) => void;
}

export function TopicFilter({ selectedTags, onTagsChange, currentRating, onRatingChange }: TopicFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [ratingInput, setRatingInput] = useState(currentRating.toString());

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearAll = () => {
    onTagsChange([]);
    onRatingChange(null);
    setRatingInput(currentRating.toString());
  };

  const handleRatingSubmit = () => {
    const rating = parseInt(ratingInput);
    if (!isNaN(rating) && rating >= 800 && rating <= 3500) {
      onRatingChange(rating);
    }
  };

  const popularTags = ["implementation", "math", "greedy", "dp", "data structures", "graphs", "binary search", "strings"];

  return (
    <Card className="border-0 shadow-lg">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <span className="font-medium">Filters</span>
              {(selectedTags.length > 0 || ratingInput !== currentRating.toString()) && (
                <Badge variant="secondary" className="ml-2">
                  {selectedTags.length} topics selected
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {(selectedTags.length > 0) && (
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          {/* Quick filter chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {popularTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            {/* Rating Override */}
            <div className="space-y-2 pb-4 border-b">
              <Label className="text-sm font-medium">Custom Rating Target</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={ratingInput}
                  onChange={(e) => setRatingInput(e.target.value)}
                  className="w-24"
                  min={800}
                  max={3500}
                  step={100}
                />
                <Button size="sm" onClick={handleRatingSubmit}>
                  Apply
                </Button>
                <span className="text-sm text-muted-foreground">
                  (800 - 3500)
                </span>
              </div>
            </div>

            {/* All Tags */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">All Topics</Label>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {PROBLEM_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
