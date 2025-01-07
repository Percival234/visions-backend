import { Prisma } from '@prisma/client';

export const clubsData: Omit<Prisma.ClubUncheckedCreateInput, 'ownerId'>[] = [
  {
    name: 'Book Lovers Club',
    description:
      'A community for book enthusiasts to share and discuss their favorite reads.',
    image:
      'https://img.freepik.com/free-photo/view-mountain-with-dreamy-aesthetic_23-2151700203.jpg?ga=GA1.1.1985331925.1729016627&semt=ais_hybrid',
  },
  {
    name: 'Tech Innovators',
    description:
      'Explore the latest trends in technology and innovation with like-minded people.',
    image:
      'https://img.freepik.com/free-photo/beautiful-nature-landscape-with-river-vegetation_23-2150705824.jpg?ga=GA1.1.1985331925.1729016627&semt=ais_hybrid',
  },
  {
    name: 'Fitness Warriors',
    description:
      'Join us to stay fit, motivated, and connected through group workouts and challenges.',
    image:
      'https://img.freepik.com/free-photo/color-year-purple-tones-abstract-landscape-with-fantasy-aesthetic_23-2151394117.jpg?ga=GA1.1.1985331925.1729016627&semt=ais_hybrid',
  },
  {
    name: 'Artistry Hub',
    description:
      'A creative space for artists to showcase their work and exchange ideas.',
    image:
      'https://img.freepik.com/free-photo/digital-art-volcano-illustrated_23-2151778829.jpg?ga=GA1.1.1985331925.1729016627&semt=ais_hybrid',
  },
  {
    name: 'Music Mania',
    description:
      'Discover, create, and celebrate music with passionate musicians and fans.',
    image:
      'https://img.freepik.com/free-photo/couple-bus-sunset_23-2151850184.jpg?ga=GA1.1.1985331925.1729016627&semt=ais_hybrid',
  },
  {
    name: 'Adventure Seekers',
    description:
      'For thrill-seekers who love exploring new places and outdoor activities.',
    image:
      'https://img.freepik.com/free-photo/surreal-planet-illustration_23-2151877934.jpg?ga=GA1.1.1985331925.1729016627&semt=ais_hybrid',
  },
  {
    name: 'Coding Enthusiasts',
    description:
      'A club for developers to share knowledge, code together, and solve problems.',
    image:
      'https://img.freepik.com/free-photo/marine-landscape-cartoon-style-with-sunset_23-2151120364.jpg?ga=GA1.1.1985331925.1729016627&semt=ais_hybrid',
  },
  {
    name: 'Foodies United',
    description:
      'Savor the world of flavors with fellow food lovers and culinary adventurers.',
    image:
      'https://img.freepik.com/free-photo/surreal-neon-tropical-flowers_23-2151665810.jpg?ga=GA1.1.1985331925.1729016627&semt=ais_hybrid',
  },
  {
    name: 'Photography Passion',
    description:
      'Capture and share stunning moments with a community of photography lovers.',
    image:
      'https://img.freepik.com/free-photo/digital-art-isolated-house_23-2151041303.jpg?ga=GA1.1.1985331925.1729016627&semt=ais_hybrid',
  },
  {
    name: 'History Buffs',
    description:
      'Dive deep into history with people who love uncovering the past.',
    image:
      'https://img.freepik.com/free-photo/sky-landscape-digital-art-style-with-tree-silhouette_23-2151120841.jpg?ga=GA1.1.1985331925.1729016627&semt=ais_hybrid',
  },
  {
    name: 'Mindful Meditation',
    description:
      'Find peace and focus through group meditation and mindfulness practices.',
    image:
      'https://img.freepik.com/free-photo/galactic-night-sky-astronomy-science-combined-generative-ai_188544-9656.jpg?ga=GA1.1.1985331925.1729016627&semt=ais_hybrid',
  },
];
