/*
  Optional per-mod detail fields, keyed by Steam Workshop ID.

  Supported fields:
  - creatorNote: string
  - history: string[]
  - highlights: string[]
  - requirements: string[]
  - installation: string[]
  - credits: string[]
  - related: [{ label, url }]

  Example:
  '1234567890': {
    creatorNote: 'This was my first mod ever!!!',
    history: ['Started as...', 'Later expanded into...']
  }
*/
const modDetails = {
  '3476765858': {
    related: [
      {
        label: 'Rise of the Black Dogs video playlist',
        url: 'https://www.youtube.com/watch?v=Y-Fn-JYwl7M&list=PLYfm1U3BR20aGaYmkED4Kl3GUD9A6yj7W&pp=sAgC'
      }
    ]
  },
  '3162242823': {
    highlights: [
      '17-mission campaign bridging Battlezone and Battlezone II.',
      'Custom factions, worlds, gameplay systems, audio, and pilot-focused content.',
      'Designed as both a campaign and a broader mod pack rather than a single standalone mission.'
    ],
    related: [
      {
        label: 'ISDF Chronicles video playlist',
        url: 'https://www.youtube.com/watch?v=_0mHo1lzbBs&list=PLYfm1U3BR20aaqUgoLO1MgyiFQknZsNYX&pp=sAgC'
      }
    ]
  },
  '2973893698': {
    related: [
      {
        label: 'Legacy of the Black Dogs video playlist',
        url: 'https://www.youtube.com/watch?v=7vjC3F3QdzU&list=PLYfm1U3BR20Zquop6YL-5a4Iw7oZkK3pf&pp=0gcJCf8COCosWNinsAgC'
      }
    ]
  }
};
