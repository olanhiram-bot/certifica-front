import type { CarouselImage } from '@/interfaces/Carousel'

import banner1 from '@/assets/banner1.jpg'
import banner2 from '@/assets/banner2.png'

export const carouselImages: CarouselImage[] = [
  {
    url: banner1,
    alt: 'Banner 1',
    width: 1920,
    height: 600
  },
  {
    url: banner2,
    alt: 'Banner 2',
    width: 1920,
    height: 600
  }
]
