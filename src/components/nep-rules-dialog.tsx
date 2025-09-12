
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';
import { Scale, Star, Book, Users, Target } from 'lucide-react';

const nepRules = [
  {
    value: 'item-1',
    icon: Star,
    title: 'Flexible Curriculum Structure',
    description:
      'Students can choose subjects from different disciplines (Major, Minor, and Skill-Based courses) to create a personalized degree path.',
  },
  {
    value: 'item-2',
    icon: Book,
    title: 'Credit-Based System',
    description:
      'Courses are assigned credits based on learning hours. A minimum number of credits must be earned in Major, Minor, and other course categories to graduate.',
  },
  {
    value: 'item-3',
    icon: Users,
    title: 'Multi-Disciplinary Approach',
    description:
      'Timetables must accommodate inter-departmental classes, allowing students from one discipline to take courses offered by another.',
  },
  {
    value: 'item-4',
    icon: Target,
    title: 'Skill Enhancement Courses (SEC) & Ability Enhancement Courses (AEC)',
    description:
      'Dedicated slots for SEC and AEC are mandatory to ensure holistic development. These are often common courses for multiple student groups.',
  },
];

export function NepRulesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="NEP Rules">
            <Scale />
            NEP Rules
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>NEP 2020 Timetabling Guidelines</DialogTitle>
          <DialogDescription>
            Core principles of the National Education Policy to consider during
            scheduling.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Accordion type="single" collapsible className="w-full">
            {nepRules.map(rule => {
              const Icon = rule.icon;
              return (
                <AccordionItem key={rule.value} value={rule.value}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-3">
                      <Icon className="size-5 text-primary" />
                      <span className="font-semibold">{rule.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-8 text-muted-foreground">
                    {rule.description}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
}
