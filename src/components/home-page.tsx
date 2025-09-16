"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useAudioProcessor } from "@/hooks/use-audio-processor";
import { MicOff, AlertTriangle, Power } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { DhvaniLogo } from "./dhvani-logo";
import { useNotifications } from "@/hooks/use-notifications";

interface HomePageProps {
  audioProcessor: ReturnType<typeof useAudioProcessor>;
}

const HomePage = ({ audioProcessor }: HomePageProps) => {
  const {
    status,
    error,
    startProcessing,
    stopProcessing,
    isLeftEarEnabled,
    toggleLeftEar,
    isRightEarEnabled,
    toggleRightEar,
  } = audioProcessor;
  const { toast } = useToast();
  const { requestPermission } = useNotifications();

  const handleToggle = () => {
    requestPermission(); // Request notification permission
    if (status === "running") {
      stopProcessing();
    } else {
      startProcessing();
    }
  };

  React.useEffect(() => {
    if (status === "error" && error) {
      toast({
        variant: "destructive",
        title: "Audio Error",
        description: error,
      });
    }
  }, [status, error, toast]);

  const getStatusText = () => {
    switch (status) {
      case "running":
        return "Listening & adjusting audio...";
      case "starting":
        return "Requesting microphone access...";
      case "stopped":
        return "Ready to start.";
      case "error":
        return "An error occurred.";
      default:
        return "Ready";
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-between p-4 bg-background">
      <header className="w-full flex justify-center items-center gap-2 pt-4">
        <DhvaniLogo className="w-10 h-10" />
        <h1 className="text-4xl font-headline font-bold text-transparent bg-clip-text logo-gradient">
          Dhvani
        </h1>
      </header>

      {/* 🎙️ Recording State */}
      <div className="w-full my-6 flex-grow flex items-center justify-center">
        {status === "running" ? (
          <div className="w-full h-full rounded-lg bg-green-100 flex items-center justify-center">
            <Power className="h-24 w-24 text-green-600" />
          </div>
        ) : (
          <div className="w-full h-full rounded-lg bg-muted/50 flex items-center justify-center">
            <MicOff className="h-24 w-24 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* ⚙️ Ear Toggles + Power Button */}
      <div className="w-full flex flex-col items-center gap-4">
        <p className="text-muted-foreground font-body h-6 text-center">
          {getStatusText()}
        </p>

        {status === "error" && error && (
          <div className="flex items-center text-destructive text-sm">
            <AlertTriangle className="mr-2 h-4 w-4" />
            <p>{error}</p>
          </div>
        )}

        <Card className="w-full bg-muted/50 border-none shadow-inner">
          <CardContent className="p-4 flex flex-col gap-4">
            <div className="flex justify-around items-center pt-2">
              <div className="flex flex-col items-center gap-2">
                <Label
                  htmlFor="left-ear-switch"
                  className="font-semibold cursor-pointer"
                >
                  Left
                </Label>
                <Switch
                  id="left-ear-switch"
                  checked={isLeftEarEnabled}
                  onCheckedChange={toggleLeftEar}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <Label
                  htmlFor="right-ear-switch"
                  className="font-semibold cursor-pointer"
                >
                  Right
                </Label>
                <Switch
                  id="right-ear-switch"
                  checked={isRightEarEnabled}
                  onCheckedChange={toggleRightEar}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 🔘 Power Button */}
        <Button
          onClick={handleToggle}
          disabled={status === "starting"}
          size="lg"
          className={cn(
            "w-24 h-24 rounded-full text-xl font-bold transition-all duration-300 shadow-2xl flex flex-col items-center justify-center group",
            status === "running"
              ? "bg-destructive hover:bg-destructive/90"
              : "bg-gradient-to-br from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90",
            status === "starting" && "animate-pulse"
          )}
        >
          <Power className="h-10 w-10 transition-transform duration-300 group-hover:scale-110" />
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
