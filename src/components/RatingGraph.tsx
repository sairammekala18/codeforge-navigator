import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from "recharts";
import { CodeforcesRatingChange } from "@/types/codeforces";
import { TrendingUp } from "lucide-react";

interface RatingGraphProps {
  ratingHistory: CodeforcesRatingChange[];
}

export function RatingGraph({ ratingHistory }: RatingGraphProps) {
  if (ratingHistory.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Rating History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            No rating history available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  const data = ratingHistory.map((change, index) => ({
    contest: index + 1,
    rating: change.newRating,
    change: change.newRating - change.oldRating,
    name: change.contestName.length > 20 
      ? change.contestName.substring(0, 20) + "..." 
      : change.contestName,
    date: new Date(change.ratingUpdateTimeSeconds * 1000).toLocaleDateString(),
  }));

  const minRating = Math.min(...data.map(d => d.rating)) - 100;
  const maxRating = Math.max(...data.map(d => d.rating)) + 100;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card p-3 rounded-lg shadow-lg border text-sm">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-muted-foreground">{data.date}</p>
          <p className="font-bold text-primary">Rating: {data.rating}</p>
          <p className={data.change >= 0 ? "text-success" : "text-destructive"}>
            {data.change >= 0 ? "+" : ""}{data.change}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Rating History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="contest" 
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={[minRating, maxRating]} 
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={1200} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" opacity={0.3} />
              <ReferenceLine y={1400} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" opacity={0.3} />
              <ReferenceLine y={1600} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" opacity={0.3} />
              <ReferenceLine y={1900} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" opacity={0.3} />
              <Area 
                type="monotone" 
                dataKey="rating" 
                stroke="none"
                fill="url(#ratingGradient)"
              />
              <Line 
                type="monotone" 
                dataKey="rating" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: "hsl(var(--primary))" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-2 text-xs text-muted-foreground">
          <span>{ratingHistory.length} contests</span>
          <span>•</span>
          <span>Latest: {data[data.length - 1]?.rating}</span>
        </div>
      </CardContent>
    </Card>
  );
}
