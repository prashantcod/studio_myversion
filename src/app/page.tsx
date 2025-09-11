import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BookCopy,
  Cpu,
  GraduationCap,
  Share2,
  Users,
} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Header} from '@/components/header';
import {Footer} from '@/components/footer';
import {placeholderImages} from '@/lib/placeholder-images.json';

export default function Home() {
  const heroImage = placeholderImages.find(img => img.id === 'hero-image');

  const features = [
    {
      icon: <Cpu className="size-8 text-primary" />,
      title: 'AI-Powered Generation',
      description:
        'Leverage advanced AI to generate conflict-free, optimized timetables in minutes, not weeks.',
    },
    {
      icon: <BookCopy className="size-8 text-primary" />,
      title: 'NEP 2020 Compliant',
      description:
        'Fully supports Major/Minor courses, credit systems, and multi-disciplinary structures.',
    },
    {
      icon: <Users className="size-8 text-primary" />,
      title: 'Collaborative Platform',
      description:
        'Dedicated interfaces for administrators, faculty, and students to manage their roles effectively.',
    },
    {
      icon: <GraduationCap className="size-8 text-primary" />,
      title: 'Student-Centric',
      description:
        'Empower students with a simple interface to select electives and view their personalized schedules.',
    },
    {
      icon: <Share2 className="size-8 text-primary" />,
      title: 'Seamless Integration',
      description:
        'Easily import existing data for courses, faculty, and students to get started quickly.',
    },
    {
      icon: <ArrowRight className="size-8 text-primary" />,
      title: 'Dynamic & Flexible',
      description:
        'Simulate scenarios, handle exceptions, and dynamically edit schedules with an intuitive UI.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Intelligent Timetabling for the Modern University
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Effortlessly generate conflict-free, optimized schedules
                    compliant with NEP 2020. Empower your administration,
                    faculty, and students.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <Link href="/dashboard">
                      Get Started Now <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="#">Learn More</Link>
                  </Button>
                </div>
              </div>
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={600}
                  height={400}
                  data-ai-hint={heroImage.imageHint}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                />
              )}
            </div>
          </div>
        </section>

        <section id="features" className="w-full bg-card py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                  A System Built for Complexity
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides all the tools necessary to manage the
                  intricate scheduling demands of NEP 2020, from data input to
                  final export.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(feature => (
                <Card key={feature.title} className="flex flex-col">
                  <CardHeader>
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl/tight">
                From Chaos to Clarity in Three Simple Steps
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our guided process simplifies timetable generation, making it
                accessible and manageable for your administrative team.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Import Data</h3>
                  <p className="text-muted-foreground">
                    Upload your course structures, faculty availability,
                    student preferences, and room details using our structured
                    templates.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Generate Timetable</h3>
                  <p className="text-muted-foreground">
                    Initiate the AI generation process. Our system analyzes all
                    constraints to create an optimized, conflict-free draft.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Review & Export</h3>
                  <p className="text-muted-foreground">
                    Visualize the timetable, make manual adjustments, resolve
                    any flagged conflicts, and export the final schedule in PDF
                    or Excel formats.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
