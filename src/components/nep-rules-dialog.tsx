
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
      "NEP 2020 introduces a highly flexible and choice-based curriculum. Timetabling must accommodate multiple entry/exit points and a diverse range of subject combinations. Key components include: Major (Core) Subjects: The student's primary field of study, forming the bulk of their credits. Minor Subjects: A secondary field of study, often from a different discipline, allowing for broader knowledge. Interdisciplinary Courses: Subjects available to students from any department to foster cross-domain expertise. Vocational & Skill Courses: Practical, skill-based training integrated into the degree to enhance employability.",
  },
  {
    value: 'item-2',
    icon: Book,
    title: 'Credit-Based System & ABC',
    description:
      "All courses are assigned credits based on learning hours (lectures, tutorials, practicals). The system tracks each student's accumulated credits through the Academic Bank of Credits (ABC), a national-level digital repository. The timetable must be structured to ensure that students can fulfill the credit requirements for their Major, Minor, and other categories within the specified semester, while also allowing them to take on additional credits if they choose.",
  },
  {
    value: 'item-3',
    icon: Users,
    title: 'Multi-Disciplinary Approach',
    description:
      "A core principle of NEP is breaking down the hard silos between arts, science, and commerce. This allows students to take courses from various departments. From a timetabling perspective, this is a major challenge. The system must resolve potential clashes for popular interdisciplinary courses that are in demand across different student groups. It requires sophisticated logic to ensure faculty, classrooms, and labs are available for these shared, high-demand sessions without disrupting the core schedules of each department.",
  },
  {
    value: 'item-4',
    icon: Target,
    title: 'Skill & Ability Enhancement',
    description:
      'The curriculum mandates the inclusion of several types of enhancement courses: Skill Enhancement Courses (SEC): Designed to develop practical, job-oriented skills. Ability Enhancement Courses (AEC): Focused on improving language and communication abilities. Value-Added Courses (VAC): Aimed at instilling humanistic, ethical, and constitutional values. These courses are often common for all first-year or second-year students, creating large, combined classes that must be scheduled without conflicting with a wide array of other major/minor subjects.',
  },
];

export function NepRulesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="NEP Rules" className="gap-2.5 py-1.5">
            <Scale className="size-4" />
            <span className="text-sm">NEP Rules</span>
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
