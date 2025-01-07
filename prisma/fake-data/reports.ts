import { Prisma } from '@prisma/client';

export const reportsData: Omit<Prisma.ReportUncheckedCreateInput, 'userId'>[] =
  [
    {
      text: 'The first report text must have more than 20 symbols.',
      type: 'Type1',
      isMarked: true,
      read: new Date('2024-01-01T12:00:00Z'),
    },
    {
      text: 'Another example of a valid report with sufficient text.',
      type: 'Type2',
      isMarked: false,
      read: null,
    },
    {
      text: 'This is a test report that meets the required length.',
      type: 'Type3',
      isMarked: true,
      read: new Date('2024-02-15T15:30:00Z'),
    },
    {
      text: 'A detailed description of the issue being reported.',
      type: 'Type4',
      isMarked: false,
      read: null,
    },
    {
      text: 'The report contains enough details to pass validation.',
      type: 'Type1',
      isMarked: true,
      read: new Date('2024-03-20T10:45:00Z'),
    },
    {
      text: 'Another valid report with an appropriate length.',
      type: 'Type2',
      isMarked: false,
      read: null,
    },
    {
      text: 'Detailed steps to reproduce an issue for the report.',
      type: 'Type3',
      isMarked: true,
      read: new Date('2024-04-10T09:00:00Z'),
    },
    {
      text: 'A valid report containing more than 20 characters.',
      type: 'Type4',
      isMarked: false,
      read: null,
    },
    {
      text: 'The report content includes all necessary details.',
      type: 'Type1',
      isMarked: true,
      read: new Date('2024-05-05T08:30:00Z'),
    },
    {
      text: 'This report is valid and ready for testing purposes.',
      type: 'Type2',
      isMarked: false,
      read: null,
    },
    {
      text: 'A sufficiently long report for testing purposes.',
      type: 'Type3',
      isMarked: true,
      read: new Date('2024-06-15T14:15:00Z'),
    },
    {
      text: 'Another example of a detailed and valid report.',
      type: 'Type4',
      isMarked: false,
      read: null,
    },
    {
      text: 'Descriptive report text for testing and validation.',
      type: 'Type1',
      isMarked: true,
      read: new Date('2024-07-01T11:20:00Z'),
    },
    {
      text: 'A test report designed to pass the validation rules.',
      type: 'Type2',
      isMarked: false,
      read: null,
    },
    {
      text: 'This report includes sufficient detail for testing.',
      type: 'Type3',
      isMarked: true,
      read: new Date('2024-08-10T07:00:00Z'),
    },
    {
      text: 'A valid report created for testing purposes only.',
      type: 'Type4',
      isMarked: false,
      read: null,
    },
    {
      text: 'Detailed issue description that meets validation.',
      type: 'Type1',
      isMarked: true,
      read: new Date('2024-09-25T12:10:00Z'),
    },
    {
      text: 'A simple yet valid report for development tests.',
      type: 'Type2',
      isMarked: false,
      read: null,
    },
    {
      text: 'Report content is sufficiently detailed and valid.',
      type: 'Type3',
      isMarked: true,
      read: new Date('2024-10-12T16:40:00Z'),
    },
    {
      text: 'Another valid report for validation and testing.',
      type: 'Type4',
      isMarked: false,
      read: null,
    },
  ];
