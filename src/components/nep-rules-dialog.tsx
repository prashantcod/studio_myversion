
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
      'NEP 2020 emphasizes a flexible, choice-based curriculum. For timetabling, this means accounting for: 1) Major (Core) Subjects: The primary field of study. 2) Minor Subjects: A secondary field of study from a different discipline. 3) Interdisciplinary Courses: Subjects open to students from any department. 4) Vocational Courses: Skill-based training integrated into the degree.',
  },
  {
    value: 'item-2',
    icon: Book,
    title: 'Credit-Based System',
    description:
      "All courses are assigned credits based on learning hours. The system must track each student's accumulated credits via the Academic Bank of Credits (ABC). Timetables must ensure students can meet the required credits for their Major, Minor, and other categories within the specified timeframe.",
  },
  {
    value: 'item-3',
    icon: Users,
    title: 'Multi-Disciplinary Approach',
    description:
      'Institutional silos are broken down, allowing students to take courses from various departments. The timetable must resolve potential clashes for common courses that are popular across different student groups and ensure faculty and classroom availability for these inter-departmental sessions.',
  },
  {
    value: 'item-4',
    icon: Target,
    title: 'Skill & Ability Enhancement',
    description:
      'The curriculum must include: 1) Skill Enhancement Courses (SEC): To develop practical, job-oriented skills. 2) Ability Enhancement Courses (AEC): To improve language and communication skills. 3) Value-Added Courses (VAC): To instill humanistic, ethical, and constitutional values. These are often common for all students in a semester.',
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
