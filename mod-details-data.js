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
*/
const modDetails = {
  '3686673790': {
    creatorNote: "This is where most of my current Battlezone development lives. I originally wanted to make the stock campaign feel better to play, but fixing mission problems kept leading deeper into engine behavior. That gradually turned the project into both a campaign rewrite and an unofficial runtime patch for Redux.",
    history: [
      "Campaign Reimagined began as an effort to revisit the original NSDF campaign without replacing what made it Battlezone. The goal is to preserve the original progression, atmosphere, and mission identity while making the missions more reliable, reactive, configurable, and maintainable.",
      "As the early missions were rebuilt, Redux engine limitations and inherited behavior increasingly became part of the problem. Instead of endlessly working around those issues in Lua or ODFs, the campaign became the live integration environment for OpenShim, Extra Utilities, and bzfile. Engine fixes, restored 1.5 behavior, new Lua-facing capabilities, diagnostics, rendering work, and campaign systems are developed together instead of as isolated mods.",
      "The Workshop release is therefore much more than a mission pack. It combines rewritten mission logic, shared Lua systems, replacement maps and assets, renderer content, native DLL extensions, configuration, diagnostics, and installation/update tooling into one coordinated package. The active rewrite is still focused on the early NSDF campaign and should be considered experimental while that work continues."
    ],
    highlights: [
      "Rewritten early NSDF campaign missions with repaired objective flow, safer persistence, and difficulty-aware encounters.",
      "OpenShim engine fixes and restored legacy behavior, including destruction debris, HUD improvements, input options, multiplayer fixes, and native autosaves.",
      "Extra Utilities integration exposing additional native engine and Ogre functionality to Lua mission systems.",
      "Persistent PDA, career, loadout, subtitle, radio, weather, AI, lighting, and gameplay-assistance systems.",
      "Integrated diagnostics, crash logging, manifest validation, deployment tooling, and reproducible Workshop publishing."
    ],
    requirements: [
      "Battlezone 98 Redux on Windows; the current native components target the 32-bit 2.2.301 build.",
      "Other native DLL-based Battlezone modifications should be removed before troubleshooting compatibility problems."
    ],
    installation: [
      "Subscribe to the Workshop item and mark Campaign Reimagined active.",
      "Start one of the mod's missions. The package installs or updates OpenShim by copying winmm.dll beside battlezone98redux.exe.",
      "Restart Battlezone when prompted so the newly installed native patch can load.",
      "To remove the native patch, delete the Campaign Reimagined winmm.dll from the Battlezone installation directory."
    ],
    credits: [
      "GrizzlyOne95 — current campaign maintenance, integration, mission work, and project stewardship.",
      "VTrider — Extra Utilities groundwork used throughout the addon stack.",
      "OpenShim, Extra Utilities, bzfile, and earlier Battlezone community contributors whose work supports the integrated runtime."
    ],
    related: [
      { label: 'Campaign Reimagined source', url: 'https://github.com/GrizzlyOne95/Battlezone98Redux_CampaignReimagined' },
      { label: 'OpenShim source', url: 'https://github.com/GrizzlyOne95/Battlezone98Redux_Shim' },
      { label: 'Extra Utilities source', url: 'https://github.com/GrizzlyOne95/ExtraUtilities' },
      { label: 'bzfile source', url: 'https://github.com/GrizzlyOne95/bzfile' }
    ]
  },

  '3536800125': {
    creatorNote: "Resurgence became a home for Battlezone ideas that were interesting enough to preserve and experiment with, but did not necessarily belong in one of my more tightly scoped campaigns. I now think of it more as an experimental asset pack and playground than a project that needs to be forced into a perfectly finished campaign.",
    history: [
      "Battlezone: Resurgence was built as a large experimental mod pack for cut units, abandoned concepts, unusual mechanics, and material carried forward from several Battlezone projects. It was intentionally broader and less conservative than my campaign-focused releases.",
      "The pack grew to include a mostly complete scripted CCA campaign, a West Germany faction playground map, the Lost Brigade units, reusable Lua modules for custom mechanics, new HUD and sound material, custom weapons, and a large amount of experimental faction and gameplay content.",
      "Rather than hide unfinished work or discard useful assets, the current release remains available as an open-beta/open-source-style asset pack. It is not in active feature development and some pieces are intentionally incomplete, but the content can still be explored, reused, and built upon with appropriate credit."
    ],
    highlights: [
      "Mostly complete custom CCA campaign built around the expanded unit set.",
      "West Germany faction playground and completed faction content originally begun by Cothonian, with later work by GroovySphinx and GrizzlyOne95.",
      "Lost Brigade units created by GrizzlyOne95.",
      "Reusable Lua modules for experimental unit and gameplay mechanics.",
      "Large collection of custom weapons, sprites, HUD elements, sound effects, faction assets, and prototype content."
    ],
    requirements: [
      "This is an open-beta/experimental release; unfinished features, bugs, and incomplete campaign content should be expected."
    ],
    credits: [
      "GrizzlyOne95 — Resurgence integration, Lost Brigade units, campaign and experimental content.",
      "Cothonian — original West Germany faction work.",
      "GroovySphinx — West Germany faction development and completion work.",
      "Additional Battlezone community creators whose credited assets and experiments are preserved in the pack."
    ]
  },

  '3476765858': {
    creatorNote: "Rise of the Black Dogs was a chance to revisit one of the strangest and most interesting corners of Battlezone history: the Nintendo 64 campaign I had known about for years but could never simply play as part of the PC game. I wanted the Redux version to feel recognizable to people who remember the N64 release while still being large enough, polished enough, and flexible enough to stand on its own.",
    history: [
      "The Nintendo 64 version of Battlezone included an exclusive Black Dog campaign and several game modes that never shipped with the original PC release. Over the years there were community efforts to bring that material to PC, but this version is a new implementation built from scratch rather than a continuation of an older unfinished port.",
      "The project started with recreating and reinterpreting the N64 campaign flow, then expanded well beyond a straight mission conversion. All ten original missions return alongside Sniper Training and additional content, with reworked presentation, voiced characters, modernized environments, post-mission material, hidden N64 references, and a custom player Cobra tank that develops through the campaign.",
      "One of the largest additions became Pilot Mode: an optional layer that lets the player focus on first-person combat while automated base and battlefield systems keep the strategic side functioning. Arcade, cooperative, race, rapid-strategy, and bot-supported multiplayer content were also rebuilt so the release represents the wider N64 package rather than only its campaign."
    ],
    highlights: [
      "12 campaign missions including the recreated N64 campaign, Sniper Training, and additional content.",
      "Optional Pilot Mode with automated production, construction, support, defense, counterattacks, escorts, and battlefield assistance.",
      "Offline Arcade, online cooperative Arcade, Race, Rapid Strategy, and bot-supported Deathmatch content.",
      "Dynamic use of the original Rise of the Black Dogs soundtrack with in-mission playback controls.",
      "Custom Cobra player tank, Black Dog visual treatment, redesigned HUD, N64 sound effects, weather, new models, voice work, and post-mission presentation.",
      "Hidden collectibles and references tying missions back to the original Nintendo 64 release."
    ],
    installation: [
      "Subscribe to the Workshop release.",
      "Launch Battlezone 98 Redux and open Single Player > Custom Campaign to start the campaign.",
      "Additional Arcade and multiplayer content appears in the relevant menus using the ROTBD prefix."
    ],
    credits: [
      "GrizzlyOne95 — campaign recreation, scripting, systems, content integration, and overall project direction.",
      "DriveLine — art, cutscenes, playtesting, bug fixing, proofreading, and extensive development support.",
      "Guide Missile — Nintendo 64 emulation assistance and playtesting.",
      "Additional Battlezone community contributors are credited in the Workshop release's full credits discussion."
    ],
    related: [
      {
        label: 'Rise of the Black Dogs video playlist',
        url: 'https://www.youtube.com/watch?v=Y-Fn-JYwl7M&list=PLYfm1U3BR20aGaYmkED4Kl3GUD9A6yj7W&pp=sAgC'
      }
    ]
  },

  '3162242823': {
    creatorNote: "ISDF Chronicles is probably the closest I have come to treating Battlezone 98 Redux like a platform for a total conversion. I wanted to explore the gap between Battlezone and Battlezone II, then use that premise as an excuse to bring Combat Commander factions, weapons, presentation, pilot mechanics, and more ambitious scripted systems back into the first game's style of play.",
    history: [
      "ISDF Chronicles was conceived as a bridge between Battlezone 1 and Battlezone II rather than a recreation of either game. The 17-mission campaign follows that in-between space while introducing reimagined worlds, ISDF and Scion technology, new threats, and systems inspired by Battlezone: Combat Commander.",
      "The scope grew far beyond the campaign. The final pack includes Instant Action, strategy and deathmatch content; ported and modified ISDF/Scion units; a large expanded arsenal; dynamic soundtrack support; BZCC-inspired interface and visual work; first-person pilot weapons, ADS, jetpacks, grenades and persistent pilot powerups; and custom logic for service bays, bomber bays, trucks, pods, AI, and other campaign systems.",
      "Because so much content is bundled together, the release effectively became a large Battlezone total-conversion-style package rather than a normal mission set. Feature development is now complete; I only expect to revisit it for genuinely important bug fixes rather than continue expanding the scope indefinitely."
    ],
    highlights: [
      "17-mission fully voiced campaign bridging Battlezone and Battlezone II.",
      "5 Instant Action missions, 1 Deathmatch map, and 3 Strategy maps.",
      "Ported and adapted ISDF and Scion factions with hover-compatible vehicles and custom campaign behavior.",
      "Large Battlezone: Combat Commander-inspired weapon set with upgraded effects and presentation.",
      "First-person pilot gameplay with ADS, animated weapons, jetpacks, grenades, flashlight, and persistent pilot powerups.",
      "Dynamic soundtrack, 4K skyboxes, weather, upgraded worlds, custom planet introductions, and BZCC-inspired HUD/UI presentation.",
      "Custom service-bay, bomber-bay, truck, pod, AI, and experimental technology systems."
    ],
    requirements: [
      "ISDF Chronicles: HUD Mod is a required companion Workshop item.",
      "For the intended presentation, the release recommends English localization and avoiding other gameplay-changing mods."
    ],
    installation: [
      "Subscribe to the campaign/mod pack and its required HUD companion item.",
      "The download is large and contains thousands of files, models, textures, and music tracks; an SSD is strongly recommended.",
      "Campaign and other included content use the ISDFC prefix for easier discovery in Battlezone's menus."
    ],
    credits: [
      "GrizzlyOne95 — campaign, systems, content integration, scripting, porting, and project direction.",
      "Battlezone community contributors whose music, models, testing, ideas, and prior work supported the project; the complete credit list is maintained with the Workshop release.",
      "Assets from the release may be reused in other projects with appropriate credit, subject to the rights of their original creators."
    ],
    related: [
      {
        label: 'ISDF Chronicles video playlist',
        url: 'https://www.youtube.com/watch?v=_0mHo1lzbBs&list=PLYfm1U3BR20aaqUgoLO1MgyiFQknZsNYX&pp=sAgC'
      }
    ]
  },

  '2973893698': {
    creatorNote: "Legacy of the Black Dogs was my attempt to make a genuinely new Black Dog campaign rather than remake an existing one. It let me write an original continuation, experiment with larger scripted battles and pilot gameplay, and pull together a lot of the strange cut-unit and faction ideas that make Battlezone's universe fun to mod.",
    history: [
      "Legacy of the Black Dogs is a nine-mission original campaign set in the classic Battlezone universe. The story begins with a CCA ambush on the Moon and follows the Black Dogs through a storyline designed to connect with the original NSDF/CCA campaigns, The Red Odyssey, and events leading toward Battlezone II.",
      "Seven of the nine missions use original terrain, including new worlds on Callisto, Iapetus, and Pluto, while the remaining missions revisit recognizable locations from the series. The campaign added new pilot weapons, custom vehicle weapons, voice work, dynamic music, hidden areas, and a wide range of new or returning units inspired in part by concepts that never made it into the original Battlezone releases.",
      "The missions deliberately vary their structure: some put the player into coordinated wingman attacks or sniper roles, while others focus on defense, command, or large cinematic assaults. Development is now complete aside from the possibility of critical fixes."
    ],
    highlights: [
      "9 fully scripted missions forming an original Black Dog storyline.",
      "3 new worlds — Callisto, Iapetus, and Pluto — plus a bonus Mars-at-night environment.",
      "Custom weapons including Plasma Stabber, Flak Cannon, Lightning Barrage, Cluster Rocket, Havoc Cannon, and Devastator Missile.",
      "Expanded pilot combat with shotgun, bazooka, jetpack, and mission-specific explosives.",
      "New and returning units including drone carriers, heavy tanks, Strikers, Nightingale mobile repair support, new Fury units, rocket defenses, and Black Dog equipment.",
      "Dynamic soundtrack and extensive mission voice work built from edited original lines and new community-recorded dialogue.",
      "Mission variety ranging from sniper and wingman scenarios to defense missions and large command-heavy assaults."
    ],
    requirements: [
      "The Classic Models Mod should be disabled while playing because it can break several custom units used by the campaign."
    ],
    credits: [
      "GrizzlyOne95 — story, mission scripting, campaign integration, gameplay systems, and project direction.",
      "Kingfurykiller and SexxyRexxy — voice work for the majority of missions 2 through 8.",
      "ScrapPool — Burns Rebellion weapons/units incorporated with credit.",
      "Additional Battlezone community contributors are credited in the Workshop release's full acknowledgements."
    ],
    related: [
      {
        label: 'Legacy of the Black Dogs video playlist',
        url: 'https://www.youtube.com/watch?v=7vjC3F3QdzU&list=PLYfm1U3BR20Zquop6YL-5a4Iw7oZkK3pf&pp=0gcJCf8COCosWNinsAgC'
      }
    ]
  }
};
