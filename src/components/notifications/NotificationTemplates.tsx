"use client";

import { Template } from "@/data/mock/notifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Copy, Trash, MessageSquare } from "lucide-react";

interface NotificationTemplatesProps {
  templates: Template[];
}

export function NotificationTemplates({ templates }: NotificationTemplatesProps) {
  return (
    <div className="space-y-4">
        <div className="flex justify-between items-center bg-card p-4 rounded-lg border shadow-sm">
            <div>
               <h2 className="text-lg font-medium">Notification Templates</h2>
               <p className="text-sm text-muted-foreground">Manage and reuse notification content</p>
            </div>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
         </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow group">
                <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div>
                    <CardTitle className="text-base flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary/50" />
                        {template.name}
                    </CardTitle>
                    <Badge variant="outline" className="mt-2 font-normal text-xs">{template.category}</Badge>
                    </div>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        Use Template
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                </CardHeader>
                <CardContent>
                <div className="space-y-2 bg-muted/40 p-3 rounded-md">
                    <p className="text-xs font-semibold text-foreground/80">{template.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{template.body}</p>
                </div>
                </CardContent>
            </Card>
            ))}
            
            <Button variant="outline" className="h-auto min-h-[160px] flex flex-col gap-2 items-center justify-center border-dashed text-muted-foreground hover:text-primary hover:border-primary/50">
                <Plus className="w-8 h-8 opacity-50" />
                <span>Create New Template</span>
            </Button>
        </div>
    </div>
  );
}
