'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { TrendingUp } from 'lucide-react';

interface ParameterAdjustmentProps {
  adjustment: number;
  onAdjustmentChange: (value: number) => void;
  disabled: boolean;
}

export function ParameterAdjustment({ adjustment, onAdjustmentChange, disabled }: ParameterAdjustmentProps) {
  const handleSliderChange = (value: number[]) => {
    onAdjustmentChange(value[0]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          What-If Analysis
        </CardTitle>
        <CardDescription>Adjust the forecast to model different scenarios.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="adjustment-slider" className="text-sm font-medium">Forecast Adjustment ({adjustment}%)</Label>
            <Slider
              id="adjustment-slider"
              min={-50}
              max={50}
              step={1}
              value={[adjustment]}
              onValueChange={handleSliderChange}
              disabled={disabled}
              aria-label="Forecast Adjustment Slider"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Use the slider to simulate growth or decline in your sales forecast. This helps in planning for optimistic or pessimistic scenarios.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
