'use client';

import { Bot } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface InsightsDisplayProps {
  isLoading: boolean;
  insights?: string;
}

export function InsightsDisplay({ isLoading, insights }: InsightsDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-accent" />
          AI Insights
        </CardTitle>
        <CardDescription>Key takeaways from your sales data.</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[150px] text-sm">
        {isLoading ? (
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
            </div>
        ) : insights ? (
          <p className="whitespace-pre-wrap">{insights}</p>
        ) : (
            <p className="text-muted-foreground">AI-generated insights will be displayed here once you generate a forecast.</p>
        )}
      </CardContent>
    </Card>
  );
}
