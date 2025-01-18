import { Prisma } from '@prisma/client';

export const usersData: Prisma.UserCreateInput[] = [
  {
    email: 'qwerty123@gmail.com',
    password: '$2b$10$j/8.Fwag7HK1oaCQH/yKleqJQTnSHNOHg1rumIQMAVpzeAd3m2eBa',
    username: 'Mike',
    about:
      '"The only limit to our realization of tomorrow is our doubts of today."',
    location: 'New York, USA',
  },
  {
    email: 'molly123@gmail.com',
    password: '$2b$10$j/8.Fwag7HK1oaCQH/yKleqJQTnSHNOHg1rumIQMAVpzeAd3m2eBa',
    username: 'Molly',
    about: '"Imagination is more important than knowledge."',
    location: 'Los Angeles, USA',
  },
  {
    email: 'john_doe1@gmail.com',
    password: '$2b$10$j/8.Fwag7HK1oaCQH/yKleqJQTnSHNOHg1rumIQMAVpzeAd3m2eBa',
    username: 'John Doe',
    about: '"In the middle of every difficulty lies opportunity."',
    location: 'Chicago, USA',
  },
  {
    email: 'jane_smith2@gmail.com',
    password: '$2b$10$j/8.Fwag7HK1oaCQH/yKleqJQTnSHNOHg1rumIQMAVpzeAd3m2eBa',
    username: 'Jane Smith',
    about:
      '"The future belongs to those who believe in the beauty of their dreams."',
    location: 'San Francisco, USA',
  },
  {
    email: 'bob_brown3@gmail.com',
    password: '$2b$10$j/8.Fwag7HK1oaCQH/yKleqJQTnSHNOHg1rumIQMAVpzeAd3m2eBa',
    username: 'Bob Brown',
    about:
      '"Success is not final, failure is not fatal: It is the courage to continue that counts."',
    location: 'Boston, USA',
  },
  {
    email: 'alice_white4@gmail.com',
    password: '$2b$10$j/8.Fwag7HK1oaCQH/yKleqJQTnSHNOHg1rumIQMAVpzeAd3m2eBa',
    username: 'Alice White',
    about:
      '"Do not go where the path may lead, go instead where there is no path and leave a trail."',
    location: 'Seattle, USA',
  },
  {
    email: 'charlie_davis5@gmail.com',
    password: '$2b$10$j/8.Fwag7HK1oaCQH/yKleqJQTnSHNOHg1rumIQMAVpzeAd3m2eBa',
    username: 'Charlie Davis',
    about:
      '"Happiness is not something ready-made. It comes from your own actions."',
    location: 'Austin, USA',
  },
  {
    email: 'emma_clark6@gmail.com',
    password: '$2b$10$j/8.Fwag7HK1oaCQH/yKleqJQTnSHNOHg1rumIQMAVpzeAd3m2eBa',
    username: 'Emma Clark',
    about: '"Life is what happens when you’re busy making other plans."',
    location: 'Portland, USA',
  },
  {
    email: 'oliver_lewis7@gmail.com',
    password: '$2b$10$j/8.Fwag7HK1oaCQH/yKleqJQTnSHNOHg1rumIQMAVpzeAd3m2eBa',
    username: 'Oliver Lewis',
    about: '"Don’t watch the clock; do what it does. Keep going."',
    location: 'Denver, USA',
  },
  {
    email: 'ava_hall8@gmail.com',
    password: '$2b$10$j/8.Fwag7HK1oaCQH/yKleqJQTnSHNOHg1rumIQMAVpzeAd3m2eBa',
    username: 'Ava Hall',
    about: '"Act as if what you do makes a difference. It does."',
    location: 'Miami, USA',
  },
];
