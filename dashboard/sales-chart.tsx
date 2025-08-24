'use client';

import { useMemo } from 'react';
import { Area, AreaChart as RechartsAreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartDataPoint } from '@/lib/types';
import { parseCsv } from '@/lib/csv-helper';

interface SalesChartProps {
  historicalData: string;
  forecastData: string;
}

function prepareChartData(historicalCsv: string, forecastCsv: string): ChartDataPoint[] {
    const dataMap = new Map<string, ChartDataPoint>();

    const historicalParsed = parseCsv(historicalCsv);
    const hDateKey = Object.keys(historicalParsed[0] || {}).find(k => k.includes('date'));
    const hSalesKey = Object.keys(historicalParsed[0] || {}).find(k => k.includes('sales'));
    
    if (hDateKey && hSalesKey) {
        historicalParsed.forEach(row => {
            const date = row[hDateKey];
            if (date) {
                dataMap.set(date, {
                    date,
                    sales: parseFloat(row[hSalesKey]) || null,
                    forecast: null,
                });
            }
        });
    }

    const forecastParsed = parseCsv(forecastCsv);
    const fDateKey = Object.keys(forecastParsed[0] || {}).find(k => k.includes('date'));
    const fForecastKey = Object.keys(forecastParsed[0] || {}).find(k => k.includes('forecast'));

    if (fDateKey && fForecastKey) {
        forecastParsed.forEach(row => {
            const date = row[fDateKey];
            const forecastValue = parseFloat(row[fForecastKey]) || null;
            if (date) {
                const existing = dataMap.get(date);
                if (existing) {
                    existing.forecast = forecastValue;
                } else {
                    dataMap.set(date, {
                        date,
                        sales: null,
                        forecast: forecastValue,
                    });
                }
            }
        });
    }
    
    return Array.from(dataMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}


export function SalesChart({ historicalData, forecastData }: SalesChartProps) {
    const chartData = useMemo(() => prepareChartData(historicalData, forecastData), [historicalData, forecastData]);

    if (chartData.length === 0) {
        return <div className="flex items-center justify-center h-full text-muted-foreground p-4 text-center">Could not render chart. Please ensure the CSV data is correctly formatted with 'Date' and 'Sales' columns.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(str) => {
                      try {
                        const date = new Date(str);
                        if (chartData.length > 12) {
                          return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit'});
                        }
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric'});
                      } catch (e) {
                        return str;
                      }
                    }}
                />
                <YAxis 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip
                    cursor={{
                      stroke: 'hsl(var(--accent))',
                      strokeWidth: 1,
                      strokeDasharray: '3 3',
                    }}
                    content={
                      <ChartTooltipContent 
                        indicator="dot"
                        labelFormatter={(label) => new Date(label).toLocaleDateString("en-US", {month: 'long', day: 'numeric', year: 'numeric'})}
                        formatter={(value, name) => {
                          const isSales = name === 'sales';
                          return (
                           <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: isSales ? 'hsl(var(--primary))' : 'hsl(var(--accent))' }}/>
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">{isSales ? 'Historical Sales' : 'Forecasted Sales'}</span>
                              <span className="font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value as number)}</span>
                            </div>
                           </div>
                        )}}
                      />
                    }
                />
                <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="sales" name="sales" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" connectNulls />
                <Area type="monotone" dataKey="forecast" name="forecast" stroke="hsl(var(--accent))" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorForecast)" connectNulls />
            </RechartsAreaChart>
        </ResponsiveContainer>
    );
}
