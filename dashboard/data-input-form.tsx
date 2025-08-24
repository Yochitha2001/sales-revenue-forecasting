'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAnalytics } from '@/app/actions';
import type { AnalyticsResult } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const FormSchema = z.object({
  salesData: z.string().min(50, {
    message: 'Please provide sufficient historical sales data for a meaningful forecast (at least 50 characters).',
  }).refine(data => data.toLowerCase().includes('date') && data.toLowerCase().includes('sales'), {
    message: "CSV data must contain 'Date' and 'Sales' columns.",
  }),
});

const placeholderData = `Date,Sales
2022-01-01,2100.00
2022-02-01,2200.00
2022-03-01,2500.00
2022-04-01,2400.00
2022-05-01,2700.00
2022-06-01,2800.00
2022-07-01,3000.00
2022-08-01,2950.00
2022-09-01,3200.00
2022-10-01,3400.00
2022-11-01,3800.00
2022-12-01,4500.00
2023-01-01,4300.50
2023-02-01,4500.75
2023-03-01,4800.00
2023-04-01,4700.25
2023-05-01,5100.00
2023-06-01,5300.50
2023-07-01,5500.00
2023-08-01,5400.75
2023-09-01,5800.25
2023-10-01,6100.00
2023-11-01,6500.50
2023-12-01,7500.75
`;

interface DataInputFormProps {
  onAnalyticsUpdate: (data: AnalyticsResult | null, isLoading: boolean, error: string | null) => void;
  isLoading: boolean;
}

export function DataInputForm({ onAnalyticsUpdate, isLoading }: DataInputFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        salesData: placeholderData,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    onAnalyticsUpdate(null, true, null);
    const result = await getAnalytics(data.salesData);

    if (result.success && result.data) {
      onAnalyticsUpdate({ ...result.data, historicalData: data.salesData }, false, null);
      toast({
        title: 'Success!',
        description: 'Your sales forecast and insights have been generated.',
      });
    } else {
      onAnalyticsUpdate(null, false, result.error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: result.error,
      });
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Data Input</CardTitle>
        <CardDescription>Paste your historical sales data in CSV format.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="salesData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sales Data (CSV)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={placeholderData}
                      className="min-h-[300px] md:min-h-[400px] font-mono text-xs resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : 'Generate Forecast'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
