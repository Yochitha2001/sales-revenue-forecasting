'use client';

import { FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ForecastAnalysisDisplayProps {
  isLoading: boolean;
  analysis?: string;
  technique?: string;
  rationale?: string;
}

export function ForecastAnalysisDisplay({ isLoading, analysis, technique, rationale }: ForecastAnalysisDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-accent" />
          Forecast Analysis
        </CardTitle>
        <CardDescription>Methodology behind the forecast.</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[150px] space-y-4 text-sm">
        {isLoading ? (
            <div className="space-y-4">
              <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div>
                <Skeleton className="h-5 w-20 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
               <div>
                <Skeleton className="h-5 w-28 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
        ) : analysis && technique ? (
          <>
            <div>
              <h4 className="font-semibold mb-1 text-foreground">Technique Used:</h4>
              <p className="text-muted-foreground">{technique}</p>
            </div>
            {rationale && (
              <div>
                <h4 className="font-semibold mb-1 text-foreground">Rationale:</h4>
                <p className="whitespace-pre-wrap text-muted-foreground">{rationale}</p>
              </div>
            )}
            <div>
              <h4 className="font-semibold mb-1 text-foreground">Analysis:</h4>
              <p className="whitespace-pre-wrap text-muted-foreground">{analysis}</p>
            </div>
          </>
        ) : (
            <p className="text-muted-foreground">Details about the forecast model and its analysis will appear here.</p>
        )}
      </CardContent>
    </Card>
  );
}
