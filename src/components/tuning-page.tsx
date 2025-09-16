"use client";

import React from 'react';
import { useSettings } from '@/hooks/use-settings';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AUDIO_FREQUENCIES } from '@/lib/constants';
import { ScrollArea } from './ui/scroll-area';

const TuningPage = () => {
  const { settings, updateTuning } = useSettings();

  return (
    <ScrollArea className="h-full">
      <div className="p-4 md:p-6 space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-headline font-bold text-primary">Frequency Tuning</h1>
          <p className="text-muted-foreground font-body">Fine-tune the amplification for each frequency band.</p>
        </header>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Amplification Levels</CardTitle>
            <CardDescription>Adjust the gain intensity for each frequency. Default is 50%.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-4">
            {AUDIO_FREQUENCIES.map(freq => (
              <div key={freq} className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <label className="text-sm font-medium text-foreground">
                    {freq >= 1000 ? `${freq / 1000} kHz` : `${freq} Hz`}
                  </label>
                  <span className="text-lg font-mono font-semibold text-accent w-20 text-right">
                    {settings.tuning[freq]}%
                  </span>
                </div>
                <Slider
                  min={40}
                  max={90}
                  step={1}
                  defaultValue={[50]}
                  value={[settings.tuning[freq]]}
                  onValueChange={([value]) => updateTuning(freq, value)}
                  className="[&_[role=slider]]:bg-accent"
                />
              </div>
            ))}
          </CardContent>
        </Card>
        
        <div className="text-center text-sm text-muted-foreground px-4">
          <p>Higher percentages mean stronger amplification for that specific frequency. Find a balance that sounds clear and comfortable.</p>
        </div>
      </div>
    </ScrollArea>
  );
};

export default TuningPage;
