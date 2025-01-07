import {
  Category,
  ClubRoles,
  MembershipStatus,
  Prisma,
  PrismaClient,
} from '@prisma/client';

import { categoriesData } from './fake-data/categories';
import { usersData } from './fake-data/users';
import { reportsData } from './fake-data/reports';
import { imagesData } from './fake-data/images';
import { postsData } from './fake-data/posts';
import { commentsData } from './fake-data/comments';
import { clubsData } from './fake-data/clubs';
import { notificationsData } from './fake-data/notifications';
import { markdownToHTML } from 'src/utils/markdown-to-html/markdown-to-html';

const prisma = new PrismaClient();

function getRandomNumber(max: number, min: number = 0): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function down() {
  await prisma.club.deleteMany();
  await prisma.category.deleteMany();
  await prisma.report.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.image.deleteMany();
  await prisma.user.deleteMany();
}

function getRandomCategories(categories: Category[]) {
  const onlyIds = categories.map(({ id }) => ({
    id,
  }));
  const count = Math.floor(Math.random() * 3) + 1;
  const shuffled = onlyIds.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function up() {
  const categoriesQueries = categoriesData.map((data) =>
    prisma.category.create({ data }),
  );

  const categories = await prisma.$transaction(categoriesQueries);

  const usersQueries = usersData.map((data) =>
    prisma.user.create({
      data: {
        ...data,
        settings: {
          create: {},
        },
      },
    }),
  );

  const users = await prisma.$transaction(usersQueries);

  notificationsData.map(async (notification) =>
    prisma.notification.create({
      data: {
        ...notification,
        textHtml: await markdownToHTML(notification.textMarkdown),
        senderId: users[1].id,
        userId: users[0].id,
      },
    }),
  );

  const clubsQueries = clubsData.map((data, index) =>
    prisma.club.create({
      data: {
        ...data,
        categories: {
          connect: getRandomCategories(categories),
        },
        owner: {
          connect: { id: users[index].id },
        },
        settings: {
          create: {
            isPrivate: Math.random() < 0.5,
          },
        },
        memberships: {
          create: {
            roles: [ClubRoles.Member, ClubRoles.Assistant, ClubRoles.Owner],
            status: MembershipStatus.Approved,
            user: {
              connect: { id: users[index].id },
            },
          },
        },
      },
    }),
  );

  const clubs = await prisma.$transaction(clubsQueries);

  const memberships = await prisma.$transaction(
    Array.from({ length: users.length - 1 }).map((_, index) =>
      prisma.clubMembership.create({
        data: {
          club: {
            connect: { id: clubs[0].id },
          },
          user: {
            connect: { id: users[index + 1].id },
          },
        },
      }),
    ),
  );

  const usersReportsData = reportsData.map((report) => {
    const randomUser = users[Math.floor(Math.random() * users.length)];

    return {
      ...report,
      userId: randomUser.id,
    };
  });

  await prisma.report.createMany({
    data: usersReportsData,
  });

  const usersImagesData = imagesData.map((image) => {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    return {
      ...image,
      userId: randomUser.id,
    };
  });

  const createdImages = await prisma.$transaction(
    usersImagesData.map((imageData) =>
      prisma.image.create({
        data: imageData,
      }),
    ),
  );

  const usersPostsData: Prisma.PostCreateInput[] = postsData.map(
    (post, index) => {
      return {
        ...post,
        user: {
          connect: { id: createdImages[index].userId },
        },
        image: {
          connect: { id: createdImages[index].id },
        },
        categories: {
          connect: getRandomCategories(categories),
        },
      };
    },
  );

  const posts = await prisma.$transaction(
    usersPostsData.map((postData) =>
      prisma.post.create({
        data: {
          ...postData,
          comments: {
            createMany: {
              data: commentsData.map((comment) => ({
                ...comment,
                userId: users[getRandomNumber(20)].id,
              })),
            },
          },
        },
      }),
    ),
  );
}

async function main() {
  try {
    await down();
    await up();
  } catch (error) {
    console.log(error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
