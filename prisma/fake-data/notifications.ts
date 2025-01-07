import { Prisma } from '@prisma/client';

export const notificationsData: Pick<
  Prisma.NotificationCreateInput,
  'title' | 'textMarkdown'
>[] = [
  {
    title: 'Welcome to our platform!',
    textMarkdown:
      'Thank you for joining us! We are excited to have you here. **Explore** and enjoy your journey!',
  },
  {
    title: 'Weekly Update',
    textMarkdown:
      "_Here is what's new this week_: \n- New features added\n- Bug fixes\n- Performance improvements",
  },
  {
    title: 'Account Security Alert',
    textMarkdown:
      'We detected a **login** from a new device. If this wasn’t you, [change your password immediately](https://example.com/security).',
  },
  {
    title: 'Upcoming Event Reminder',
    textMarkdown:
      '_Don’t forget!_ Our next event is on **Monday, 10 AM**. [Register here](https://example.com/events).',
  },
  {
    title: 'Congratulations!',
    textMarkdown:
      'You have been selected for a **special reward**. Claim it by clicking [here](https://example.com/reward).',
  },
  {
    title: 'Feedback Request',
    textMarkdown:
      'We value your opinion. Please take a moment to provide feedback [here](https://example.com/feedback).',
  },
  {
    title: 'Service Downtime Notification',
    textMarkdown:
      '_Important Notice_: Our services will be unavailable for maintenance on **Friday from 2 AM to 6 AM**.',
  },
  {
    title: 'Feature Release',
    textMarkdown:
      '**Great news!** We just launched a new feature. [Learn more](https://example.com/features).',
  },
  {
    title: 'Welcome Back!',
    textMarkdown:
      'It’s been a while since your last visit. Check out what’s new and trending!',
  },
  {
    title: 'Payment Confirmation',
    textMarkdown:
      'Your payment of **$29.99** has been successfully processed. Thank you!',
  },
  {
    title: 'Happy Holidays!',
    textMarkdown:
      '_Season’s Greetings!_ We wish you a joyful holiday season and a prosperous New Year!',
  },
  {
    title: 'Password Change Confirmation',
    textMarkdown:
      'Your password has been successfully changed. If this wasn’t you, [contact support](https://example.com/support).',
  },
  {
    title: 'Exclusive Offer',
    textMarkdown:
      '**Limited-time offer!** Get 30% off your next purchase. Use code: **SAVE30**.',
  },
  {
    title: 'Reminder: Complete Your Profile',
    textMarkdown:
      '_Your profile is incomplete._ Fill in the missing details to get the most out of our platform.',
  },
  {
    title: 'System Update Available',
    textMarkdown:
      '**Update now** to enjoy the latest features and security improvements.',
  },
  {
    title: 'Birthday Greetings!',
    textMarkdown:
      '_Happy Birthday!_  We hope you have an amazing day filled with joy and surprises!',
  },
  {
    title: 'Invitation to Beta Test',
    textMarkdown:
      '**You’re invited!** Help us test our new app features. [Sign up here](https://example.com/beta).',
  },
  {
    title: 'Subscription Expiring Soon',
    textMarkdown:
      'Your subscription will expire on **Dec 31, 2024**. [Renew now](https://example.com/renew).',
  },
  {
    title: 'New Message Received',
    textMarkdown: '_You have a new message._ Check your inbox for details.',
  },
  {
    title: 'Thanks for Your Support',
    textMarkdown:
      'We appreciate your continued support. [Learn how you can help even more](https://example.com/support-us).',
  },
  {
    title: 'Contest Announcement',
    textMarkdown:
      '**Join our contest!** Amazing prizes await. [Participate now](https://example.com/contest).',
  },
  {
    title: 'Daily Motivation',
    textMarkdown:
      '_Believe in yourself and all that you are._ Know that there is something inside you that is greater than any obstacle.',
  },
  {
    title: 'Meeting Reminder',
    textMarkdown:
      '_Reminder:_ Your next meeting is scheduled for **Tuesday at 3 PM**.',
  },
  {
    title: 'Policy Update',
    textMarkdown:
      '_We have updated our Terms of Service._ Please review the changes [here](https://example.com/terms).',
  },
  {
    title: 'Welcome Aboard!',
    textMarkdown:
      '**We’re thrilled to have you on our team!** Let’s achieve great things together.',
  },
];
