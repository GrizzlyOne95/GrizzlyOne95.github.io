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
  '3162242823': {
    highlights: [
      '17-mission campaign bridging Battlezone and Battlezone II.',
      'Custom factions, worlds, gameplay systems, audio, and pilot-focused content.',
      'Designed as both a campaign and a broader mod pack rather than a single standalone mission.'
    ]
  }
};
