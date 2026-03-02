"use client";

import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Send, Eye, Bell, Smartphone, Target } from "lucide-react";

interface Segment {
  value: string;
  label: string;
  count: number;
}

interface NotificationComposerProps {
  segments: Segment[];
}

export function NotificationComposer({ segments }: NotificationComposerProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [segment, setSegment] = useState("all");
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [isScheduled, setIsScheduled] = useState(false);

  const selectedSegment = segments.find((s) => s.value === segment);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Compose Form */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Notification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Enter notification title..."
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Enter notification message..."
                value={body}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {body.length}/200 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label>Target Segment</Label>
              <Select value={segment} onValueChange={setSegment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {segments.map((seg) => (
                    <SelectItem key={seg.value} value={seg.value}>
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>{seg.label}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {seg.count.toLocaleString()}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Schedule for later</Label>
                <p className="text-xs text-muted-foreground">
                  Send at a specific date and time
                </p>
              </div>
              <Switch checked={isScheduled} onCheckedChange={setIsScheduled} />
            </div>

            {isScheduled && (
              <div className="space-y-2 animate-in slide-in-from-top-2 fade-in">
                <Label>Schedule Date & Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !scheduleDate && "text-muted-foreground"
                      )}
                    >
                      <span className="mr-2 h-4 w-4 i-lucide-calendar" />
                      {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={scheduleDate}
                      onSelect={setScheduleDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button className="flex-1" disabled={!title || !body}>
                <Send className="w-4 h-4 mr-2" />
                {isScheduled ? "Schedule Notification" : "Send Now"}
              </Button>
              <Button variant="outline">
                Save as Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-3xl p-4 border shadow-inner">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 px-1">
                <Smartphone className="w-3 h-3" />
                Push Notification
              </div>
              <div className="bg-background rounded-2xl p-4 shadow-sm border">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                         <div className="font-semibold text-sm line-clamp-1 pr-2">
                            {title || "Notification Title"}
                         </div>
                         <div className="text-[10px] text-muted-foreground whitespace-nowrap">now</div>
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-3 mt-1 leading-snug">
                      {body || "Your notification message will appear here. Start typing to see how it looks!"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              Audience Reach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {selectedSegment?.count.toLocaleString() || 0}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              users will receive this notification
            </p>
            <div className="flex gap-2 mt-4 text-xs font-medium text-muted-foreground bg-muted/50 p-2 rounded">
                <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">98%</span> 
                deliverability estimate
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
