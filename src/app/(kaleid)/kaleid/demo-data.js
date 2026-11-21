// Scripted demo. Nothing here touches the network.
// Answer tokens: plain words, or { cite: n } (1-based source number).

const words = (s) =>
  s.split(/(\[\d\])/).flatMap((part) => {
    const m = part.match(/^\[(\d)\]$/);
    return m ? [{ cite: Number(m[1]) }] : part.split(/\s+/).filter(Boolean);
  });

export const SCRIPTS = [
  {
    label: 'Northwind delivery dates',
    question: 'When are the Northwind orders due to ship?',
    sources: [
      {
        title: 'Northwind Q3 supply schedule',
        kind: 'Spreadsheet · Operations',
        before: 'Batch 2, 412 units: ',
        quote: 'ships 14 October from Rotterdam',
        after: ', carrier confirmed.',
      },
      {
        title: 'Re: Northwind batch 3 delay',
        kind: 'Email thread · Sales',
        before: 'Customs hold cleared on Monday, so ',
        quote: 'batch 3 moves to 28 October',
        after: ' with no change to price.',
      },
      {
        title: 'Ticket 4821: Northwind ETA',
        kind: 'Support ticket',
        before: 'Customer asked for dates in writing. ',
        quote: 'Final delivery window is 4 to 8 November',
        after: ', per logistics.',
      },
    ],
    answer: words(
      "Northwind's order ships in three batches. Batch 2 leaves Rotterdam on 14 October. [1] Batch 3 slipped two weeks after a customs hold and now ships on 28 October. [2] Logistics has told the customer to expect final delivery between 4 and 8 November. [3]"
    ),
  },
  {
    label: 'Customers on the 2023 price list',
    question: 'Which customers are still on the 2023 price list?',
    sources: [
      {
        title: 'Pricing exceptions register',
        kind: 'Spreadsheet · Finance',
        before: 'Legacy rate locked until renewal: ',
        quote: 'Halden Foods, Oriel Labs and Tamsin & Co',
        after: '.',
      },
      {
        title: 'Oriel Labs renewal notes',
        kind: 'Doc · Account management',
        before: 'Renewal signed in March; ',
        quote: '2023 rates honoured through 31 December',
        after: ' as a one-off.',
      },
      {
        title: 'Finance sync, 12 September',
        kind: 'Meeting notes',
        before: 'Agreed to ',
        quote: 'move every legacy account to current pricing at renewal',
        after: '. No new exceptions.',
      },
    ],
    answer: words(
      'Three customers are still billed at 2023 rates: Halden Foods, Oriel Labs and Tamsin & Co. [1] Oriel Labs keeps those rates until 31 December under its renewal terms. [2] Finance has agreed that every legacy account moves to current pricing at its next renewal. [3]'
    ),
  },
  {
    label: "This year's leave policy changes",
    question: "What changed in this year's leave policy?",
    sources: [
      {
        title: 'Leave policy, this year',
        kind: 'Handbook · People',
        before: 'From 1 January, ',
        quote: 'annual leave rises from 25 to 27 days',
        after: ' for all permanent staff.',
      },
      {
        title: 'People team update, January',
        kind: 'Announcement · Chat',
        before: "We've also ",
        quote: 'doubled carry-over to 10 days',
        after: ', usable until the end of March.',
      },
    ],
    answer: words(
      'Two things changed. Annual leave went up from 25 to 27 days for permanent staff. [1] You can now carry over up to 10 unused days, as long as you use them by the end of March. [2]'
    ),
  },
];
