'use client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import messages from "@/messages.json"
import Autoplay from 'embla-carousel-autoplay'

export default function Home() {
  return (
    <>
    <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white'>
      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-3xl md:text-5xl font-bold'>
          Dive into the world of Anonymous Conversations
        </h1>
        <p className='mt-3 md:mt-4 text-base'>Explore Mystery Message - Where your identity remains secret.</p>
      </section>
      <Carousel
        plugins={[Autoplay({ delay: 2000 })]}
        className="w-full max-w-xs">
        <CarouselContent>
          {
            messages.map((message, index) => (
              < CarouselItem key={index} >
                <div className="p-1">
                  <Card>
                    <CardHeader className='text-center font-bold'>{message.title}</CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-lg font-semibold">{message.content}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))
          }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main >
    <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
      © 2023 True Feedback. All rights reserved.
    </footer>
    </>
  );
}