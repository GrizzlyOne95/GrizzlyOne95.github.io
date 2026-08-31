window.BZ_TOOL_DETAILS = {
  "world-builder": {
    name: "Redux World Builder",
    category: "World authoring suite",
    repo: "Battlezone98Redux_WorldBuilder",
    tagline: "Build, convert, visualize, and package Battlezone 98 Redux worlds from one desktop tool.",
    overview: "Redux World Builder consolidates the world-authoring jobs that normally require several legacy utilities. It can create stock-style worlds, assemble custom texture atlases, port legacy terrain, convert HG2/HGT heightmaps, prepare skyboxes, visualize missions, and auto-paint MAT terrain data.",
    features: ["Stock map creation with TRN, HG2, and MAT output", "Custom atlas generation with cap and diagonal transitions", "Legacy 1.5 world conversion into Redux atlas/TRN/material workflows", "HG2/HGT ↔ PNG heightmap conversion", "HDRI/equirectangular skybox conversion and cubemap/material setup", "Mission visualization and MAT auto-painting"],
    requirements: ["Windows or another Python-capable desktop environment", "Python 3.x when running from source", "Packages listed in requirements.txt"],
    sourceRun: "python -m pip install -r requirements.txt\npython world_builder.py",
    workflows: [
      {title: "Create a stock-style world", steps: ["Open the Stock Map Creator.", "Choose the base/default-world inputs and desired terrain parameters.", "Generate the TRN, HG2, and MAT files.", "Copy the generated files into your mod workspace and test the terrain in Redux."]},
      {title: "Build a custom texture atlas", steps: ["Prepare a folder containing the solid terrain textures you want to use.", "Open Custom Atlas Creator and select the source folder.", "Tune transition/cap settings and generate the atlas.", "Use the exported TRN, CSV, material, and texture outputs together in your world."]},
      {title: "Convert a legacy world", steps: ["Open Legacy Atlas Creator and point it at the legacy world assets.", "Convert the old MAP-based terrain into a Redux atlas.", "Use the generated TRN, CSV, and material definitions as the Redux-side starting point."]}
    ],
    notes: ["The Heightmap Converter can move terrain between HGT/HG2 and editable PNG representations.", "Skybox Tools are designed around a single HDRI/equirectangular source and generate the cubemap-side assets needed by Redux.", "Mission Visualizer and Auto-Painter are authoring aids; always verify final output in-game."]
  },
  "heightmap-generator": {
    name: "Heightmap Generator",
    category: "Procedural terrain",
    repo: "Battlezone98Redux_HeightmapGen",
    tagline: "Generate Battlezone-style HG2 terrain built around authored gameplay forms rather than generic noise.",
    overview: "The Heightmap Generator creates driveable Battlezone terrain from a library of authored-style terrain grammars: shelves, corridors, ravines, craters, basins, escarpments, planetary archetypes, and urban substrates. It supports reproducible seeds, live previews, and direct HG2 export.",
    features: ["Core, planetary, and urban terrain styles", "Fresh random seeds with reproducible seed display", "Live HG2-height, LGT-style lighting, and shaded previews", "Relief, naturalization, detail, plateau, density, symmetry, and objective-pad controls", "HG2 and lossless 16-bit PNG export", "Existing-HG2 analysis and terrain-quality diagnostics"],
    requirements: ["Python 3.10+ recommended", "Packages listed in requirements.txt"],
    sourceRun: "python -m pip install -r requirements.txt\npython heightmap_generator.py --gui",
    workflows: [
      {title: "Generate terrain in the GUI", steps: ["Launch the GUI and choose a terrain style.", "Set Zones X/Z and either keep Fresh Seed enabled or enter a fixed seed.", "Adjust Terrain Contrast / Vertical Relief and any Advanced recipe controls.", "Review the HG2 Height, LGT Lighting, and Shaded previews.", "Export the HG2 and any reference PNGs you want to keep."]},
      {title: "Reproduce a good random result", steps: ["Generate with Fresh Seed enabled.", "Copy the resolved numeric seed shown by the tool.", "Disable fresh-seed generation and reuse that seed while tuning relief/detail settings.", "Export once the terrain is ready for mission authoring."]},
      {title: "Analyze an existing HG2", steps: ["Run the analyzer from the command line with --analyze-hg2.", "Review elevation range, flat/shelf statistics, slopes, roughness, and connectivity heuristics.", "Use the diagnostics to compare generated terrain against authored maps."]}
    ],
    notes: ["Generated planetary terrain is Battlezone-inspired rather than literal real-world DEM reconstruction.", "The LGT preview is a terrain-lighting approximation; treat experimental LGT export separately from an engine-verified lighting file."]
  },
  "texture-manager": {
    name: "BZR Texture Manager",
    category: "Texture pipeline",
    repo: "Battlezone98Redux_TextureManager",
    tagline: "Convert, inspect, optimize, and author the texture formats used across Battlezone modding workflows.",
    overview: "BZR Texture Manager is a multi-tool asset pipeline covering ACT palettes, DDS/TGA/PNG textures, legacy MAP textures, LGT lightmaps, and BZ2 DXTBZ2 textures. It also provides batch processing and texture-generation helpers for modern Redux assets.",
    features: ["ACT palette editing with engine-reserved index helpers", "DDS/TGA/PNG conversion and batch processing", "DXT1/DXT5 compression, mipmaps, power-of-two scaling, and alpha detection", "Normal/specular/emissive generation", "MAP ↔ PNG conversion with palette serialization", "LGT ↔ PNG conversion", "DXTBZ2 → DDS/PNG conversion"],
    requirements: ["Python 3.x when running from source", "customtkinter, Pillow, numpy, imageio/freeimage", "Microsoft texconv.exe placed beside the source tool when required"],
    sourceRun: "python -m pip install customtkinter Pillow numpy imageio imageio[freeimage]\npython tex_man.py",
    workflows: [
      {title: "Prepare Redux textures", steps: ["Open Texture Manager and select source images or a batch folder.", "Choose the target format and compression behavior.", "Enable mipmaps, resizing, or derived maps as needed.", "Convert and review the output before copying it into the mod."]},
      {title: "Edit a legacy ACT/MAP pair", steps: ["Load or edit the ACT palette in the palette tab.", "Use the MAP converter to decode a MAP texture for editing.", "Re-import the edited image and serialize it back with the active palette."]},
      {title: "Convert BZ2 textures", steps: ["Open the DXTBZ2 converter.", "Select a file or batch folder.", "Choose DDS or PNG output and run the conversion."]}
    ],
    notes: ["Use DXT1 for opaque textures and DXT5 when interpolated alpha is needed.", "Generated normal/specular/emissive maps are workflow helpers; tune them for the actual material rather than treating defaults as final art."]
  },
  "bzradio": {
    name: "BZRadio",
    category: "Audio mastering",
    repo: "Battlezone98Redux_AudioTool",
    tagline: "Master voice, unit-response, loop, and music assets into Battlezone-friendly audio formats.",
    overview: "BZRadio automates the awkward format and processing requirements of Battlezone audio. It can create radio-style VO with filters and squelch beeps, clean thrust/turbo loops, high-quality OGG music, and a CSV timing manifest for Lua/subtitle synchronization.",
    features: ["Radio VO mastering with filtering, compression, tremolo, and optional beeps", "22050 Hz mono PCM_U8 voice output", "11025 Hz mono PCM_U8 thrust/turbo loop path", "44100 Hz stereo OGG soundtrack path", "Metadata/non-audio-stream stripping", "Batch and single-file processing", "CSV duration manifest for mission scripting"],
    requirements: ["Python 3.x when running from source", "Packages listed in requirements.txt", "FFmpeg available beside the source tool for source builds/workflows that require it"],
    sourceRun: "python -m pip install -r requirements.txt\npython audio.py",
    workflows: [
      {title: "Master radio dialogue", steps: ["Use the WAV/Radio VO path.", "Select a single source file or a batch folder.", "Enable or disable radio processing and choose commbeep, unitbeep, or a custom beep.", "Export and use the resulting 22050 Hz mono PCM_U8 WAV in the mission."]},
      {title: "Prepare thrust/turbo loops", steps: ["Choose the dedicated thrust/turbo export path.", "Process the loop without radio effects.", "Use the generated 11025 Hz mono PCM_U8 WAV as the engine loop asset."]},
      {title: "Prepare mission music", steps: ["Use the OGG/music path.", "Select the source track and export at 44100 Hz stereo.", "Keep radio distortion disabled for clean soundtrack output."]}
    ],
    notes: ["The timing-manifest CSV is useful when Lua dialogue timing or subtitle timing needs to match the final mastered files.", "Radio processing is optional; disable it for assets that should remain clean."]
  },
  "localization-tool": {
    name: "Localization Tool & ODF Scanner",
    category: "Localization workflow",
    repo: "Battlezone98Redux_LocalizationTool",
    tagline: "Scan mod content, generate localization keys, and build multilingual localization-table entries.",
    overview: "The localization tool combines manual text entry with an ODF scanner. It can discover unit names from mod folders, generate Battlezone localization keys, avoid duplicate entries, and translate output into the languages supported by the workflow.",
    features: ["ODF folder scanning and unitName extraction", "Filename fallback when unitName is missing", "Smart key generation for names and mission titles", "Existing-CSV de-duplication", "French, German, Spanish, Italian, Russian, and Portuguese translation", "Progress feedback for bulk jobs"],
    requirements: ["Python 3.x when running from source", "Packages listed in requirements.txt", "Internet access for Google Translate-backed translation operations"],
    sourceRun: "python -m pip install -r requirements.txt\npython localization.py",
    workflows: [
      {title: "Scan a mod folder", steps: ["Open the ODF Scanner tab.", "Select the mod/content folder containing ODF files.", "Run the scan to collect unitName values and filename fallbacks.", "Review generated keys and merge/export them into localization_table.csv."]},
      {title: "Translate manual names", steps: ["Open Manual Mode.", "Paste English names one per line.", "Use normal words for names: keys or the mission-title input form for mission_title: keys.", "Select target languages and run translation."]}
    ],
    notes: ["The tool skips keys already present in the existing CSV rather than blindly duplicating entries.", "Machine translation should still be reviewed by a fluent speaker before a polished release."]
  },
  "font-generator": {
    name: "BZ Font Sheet Generator",
    category: "Font atlas generator",
    repo: "Battlezone98ReduxFontGenerator",
    tagline: "Create custom bzfont.dds atlases using the stock Battlezone character layout.",
    overview: "The font generator builds a complete 1024×1024 RGBA Battlezone font atlas from TTF/OTF fonts. It uses stock-derived sprite coordinates, provides baseline/alignment controls, supports separate letter and symbol fonts, and can compare the generated atlas with the stock layout.",
    features: ["Stock bzfont.st-derived atlas slot layout", "1024×1024 RGBA output", "TTF/OTF input and dual-font support", "Baseline auto-alignment and manual nudging", "Profiles for reusable settings", "Stock comparison overlay", "Direct bzfont.dds export"],
    requirements: ["Python 3.x when running from source", "Packages listed in requirements.txt", "A font containing the glyphs you intend to generate"],
    sourceRun: "python -m pip install -r requirements.txt\npython bz_generator.py",
    workflows: [
      {title: "Generate a font atlas", steps: ["Select the TTF/OTF font for letters and optionally a second font for symbols/numbers.", "Adjust font size and alignment or start with an auto-nudge preset.", "Enable the layout grid or stock overlay to check clipping and baseline placement.", "Export DDS to create bzfont.dds.", "Place bzfont.dds in the appropriate mod texture directory and verify it in-game."]},
      {title: "Fix clipped glyphs", steps: ["Enable Show Layout Grid and inspect the problem characters.", "Adjust vertical/horizontal alignment or font size.", "Confirm the chosen font actually includes the missing glyph.", "Regenerate and compare against the stock overlay before testing again in-game."]}
    ],
    notes: ["The repository includes a helper for dumping the stock bzfont.st coordinate table.", "Missing/rectangle glyphs generally indicate that the selected font does not contain those characters."]
  },
  "holotextgen": {
    name: "HoloTextGen",
    category: "HUD content generator",
    repo: "Battlezone98Redux_HoloTextGen",
    tagline: "Generate the ODF, image, and material assets needed for MakeExplosion-based in-world HUD text.",
    overview: "HoloTextGen packages the repetitive asset-authoring side of holographic text effects. Instead of manually creating each supporting image/material/ODF combination, the tool produces the files needed to display text through the Battlezone MakeExplosion technique.",
    features: ["Generates supporting ODF files", "Generates text image assets", "Generates material definitions", "Battlezone-styled desktop UI", "Designed specifically around the MakeExplosion holographic-text technique"],
    requirements: ["Python 3.x when running from source", "Packages listed in requirements.txt"],
    sourceRun: "python -m pip install -r requirements.txt\npython hud_gen.py",
    workflows: [
      {title: "Create holographic text assets", steps: ["Launch HoloTextGen.", "Enter/configure the text and visual settings for the effect.", "Choose an output location for the generated assets.", "Generate the ODF/image/material set.", "Copy the generated files into your mod and trigger the generated effect with the intended MakeExplosion call."]},
      {title: "Integrate into a mission", steps: ["Keep the generated asset set together so material/image references remain valid.", "Place the files where Redux can resolve them through the mod's asset paths.", "Call the generated explosion/effect ODF from Lua at the desired position.", "Test scale, visibility, and lifetime in-game and regenerate if visual tuning is needed."]}
    ],
    notes: ["The repository README is intentionally minimal; the generator UI is the primary workflow surface.", "Treat generated names as a set—renaming individual files afterward can break internal references."]
  },
  "workshop-uploader": {
    name: "Workshop Uploader",
    category: "Steam Workshop publishing",
    repo: "Battlezone98Redux_WorkshopUploader",
    tagline: "Validate, pair, review, and publish Battlezone mods through SteamCMD with better diagnostics than the legacy uploader.",
    overview: "The Workshop Uploader is a project-centric publishing workspace. It remembers local projects and Workshop IDs, scans Battlezone content for common problems, tracks changes since the last publish, and drives SteamCMD uploads with clearer logs and recovery.",
    features: ["Saved local projects and Workshop pairing", "Steam Web API Workshop library", "ODF/material/reference validation", "TRN duplicate/line-ending checks and one-click fixes", "Legacy MAP detection", "Changed-file tracking", "SteamCMD VDF generation and upload logging", "Memory/VRAM estimate and orphan-file analysis"],
    requirements: ["Python 3.x when running from source", "Packages listed in requirements.txt", "SteamCMD", "A Steam account that owns Battlezone 98 Redux", "Optional Steam Web API key for Workshop-library features"],
    sourceRun: "python -m pip install -r requirements.txt\npython uploader.py",
    workflows: [
      {title: "Publish or update a mod", steps: ["Configure steamcmd.exe, login behavior, and optionally a Steam Web API key.", "Select/create the local mod project.", "Pair it with an existing Workshop item or leave it unpaired to create a new item.", "Fill in title, description, preview, visibility, tags, and change note.", "Review Readiness findings and apply any appropriate fixes.", "Inspect changed files since the last publish snapshot.", "Choose Review and Publish and inspect the upload log on completion."]},
      {title: "Use the readiness scanner", steps: ["Open a project before publishing.", "Review ODF/material missing-reference findings and TRN/content-structure warnings.", "Open problematic files directly from findings or apply supported one-click fixes.", "Re-scan until the remaining warnings are understood/intentional."]}
    ],
    notes: ["Native Workshop tag submission is experimental and can depend on Steam-side account state.", "The uploader improves diagnosis but does not make every warning a hard blocker; review findings in context."]
  },
  "mod-engine": {
    name: "Battlezone Mod Engine",
    category: "Mod management",
    repo: "Battlezone_ModEngine",
    tagline: "Download and manage Steam Workshop mods for Steam, GOG, Heroic, and other Battlezone installations.",
    overview: "Battlezone Mod Engine provides a cross-platform mod manager for Battlezone 98 Redux and Battlezone Combat Commander. It downloads Workshop items through SteamCMD and manages activation through links or a physical-copy fallback.",
    features: ["SteamCMD Workshop downloads without game-account credentials", "Battlezone 98 Redux and Combat Commander support", "Enable/disable/update/delete mod management", "Windows junctions and Linux symlinks", "Physical-copy fallback where links are unavailable", "GOG, Heroic, and Steam installation detection", "Windows and Linux support"],
    requirements: ["Windows 10/11 or a modern Linux distribution", "Python 3 + tkinter when running from source", "Pillow; tkinterdnd2 is optional for drag-and-drop", "SteamCMD"],
    sourceRun: "python -m pip install Pillow tkinterdnd2\npython cmd.py",
    workflows: [
      {title: "Install a Workshop mod", steps: ["Launch the app and verify the detected game and SteamCMD paths.", "Paste or drag a Steam Workshop URL/ID into the Downloader tab.", "Choose Install Mod.", "Open Manage Mods after download and enable the item for the desired game installation."]},
      {title: "Manage installed mods", steps: ["Open Manage Mods.", "Enable or disable items without deleting the downloaded copy.", "Use update checks to synchronize installed Workshop content.", "Delete items from the manager when you no longer want them cached."]}
    ],
    notes: ["Windows junctions require NTFS. On exFAT/FAT32 the app can fall back to physical copies.", "Linux link creation depends on normal filesystem permissions."]
  },
  "lobby-monitor": {
    name: "Battlezone Lobby Monitor",
    category: "Lobby client & analytics",
    repo: "Battlezone_LobbyMonitor",
    tagline: "Monitor and interact with Battlezone multiplayer lobbies without keeping the full game open.",
    overview: "Lobby Monitor is an external Battlezone multiplayer client for lobby visibility, chat, automation, alerts, and activity analytics. It supports full Battlezone 98 Redux WebSocket functionality and monitoring-only support for Combat Commander.",
    features: ["Real-time lobby/player/map monitoring", "Create/join/leave and chat interaction for Redux", "Workshop map/mod previews", "Discord relay and Rich Presence", "Auto-greeter, announcements, reconnect, watch lists, and alerts", "Proxy/IP safety options", "24-hour activity graph and CSV/text logging", "System-tray operation"],
    requirements: ["Python 3.x when running from source", "websocket-client, Pillow, pypresence, pystray and other packages from requirements.txt", "Optional Discord bot credentials for relay features"],
    sourceRun: "python -m pip install -r requirements.txt\npython bzr_monitor.py",
    workflows: [
      {title: "Monitor Redux lobbies", steps: ["Launch the monitor and establish the Redux lobby-server connection.", "Browse active lobbies, player counts, maps, and previews.", "Use filters to hide full/locked sessions if desired.", "Leave the app in the tray to continue logging and alerts."]},
      {title: "Configure alerts and automation", steps: ["Open Configuration.", "Set reconnect behavior, logging retention, sounds/window flashing, and watch-list entries.", "Configure proxy/IP safety if you want traffic routed through a proxy.", "Enable greeter or timed announcements only for lobbies you control."]},
      {title: "Connect Discord", steps: ["Open Discord Integration.", "Enter the bot token, target channel ID, and lobby ID.", "Enable relay or Rich Presence features as needed."]}
    ],
    notes: ["Battlezone Combat Commander support is monitoring-only; the full interactive path is for Battlezone 98 Redux.", "Player/network information is sensitive operational data—use it responsibly and avoid publishing logs containing personal network details."]
  },
  "bzn-scanner": {
    name: "BZN Scanner",
    category: "Mission diagnostics",
    repo: "Battlezone98Redux_BZN_Scanner",
    tagline: "Find the ODF dependencies referenced by ASCII or binary BZN mission files.",
    overview: "BZN Scanner is a focused troubleshooting utility for mission packaging. It scans a BZN for referenced ODF names, separates stock/custom references, and checks whether the referenced custom ODF files exist beside the mission.",
    features: ["ASCII BZN scanning", "Binary BZN scanning", "Referenced-ODF discovery", "Stock/custom sorting", "Presence checks against the mission directory", "Simple desktop GUI"],
    requirements: ["Python 3.x when running from source"],
    sourceRun: "python bzn_scan.py",
    workflows: [
      {title: "Check a mission before packaging", steps: ["Launch BZN Scanner.", "Select the BZN mission file you want to inspect.", "Run the scan and review the referenced ODF list.", "Pay attention to custom references reported missing from the mission directory.", "Add/fix the missing dependency or confirm that it is intentionally supplied by another mounted asset source."]},
      {title: "Troubleshoot a broken mission", steps: ["Scan the failing BZN.", "Sort/review custom ODF references first.", "Compare missing references against the mod's actual files and naming/case.", "Repackage and retest after repairing dependency issues."]}
    ],
    notes: ["A reported file missing beside the BZN can still be intentionally provided by another valid game/mod asset source; use the result as a dependency diagnostic, not an absolute packaging verdict."]
  },
  "zfs-specialist": {
    name: "ZFS Specialist",
    category: "Archive explorer & packer",
    repo: "Battlezone98Redux_ZFSSpecialist",
    tagline: "Browse, extract, decrypt, and create Battlezone ZFS archives from a modern GUI.",
    overview: "ZFS Specialist is an archive explorer/packer for Battlezone's ZFS format. It supports searching large archives, extraction, force extraction, LZO-compressed packing, and MakeZFS-compatible XOR encryption/decryption behavior.",
    features: ["Browse archive contents without full extraction", "Realtime filename/extension filtering", "Multi-file extraction", "LZO1X-1 compressed archive creation", "XOR encrypted archive handling", "Decimal, hexadecimal, or password-derived keys", "Standalone executable workflow"],
    requirements: ["Use the packaged release for the simplest setup", "Python/source dependencies and the included LZO bridge are required when developing/running from source"],
    sourceRun: "python src/unzfs.py",
    workflows: [
      {title: "Browse and extract an archive", steps: ["Open the ZFS archive in the Explorer.", "Search/filter by filename or extension if needed.", "Select one or more files.", "Choose Extract and select an output location.", "For encrypted archives, supply the appropriate key/password when required."]},
      {title: "Create a ZFS archive", steps: ["Open the Packer tab.", "Select the folder whose contents should be archived.", "Configure the desired XOR key if encryption is required.", "Build the archive and verify it with the Explorer before distributing it."]},
      {title: "Enter an encryption key", steps: ["Use a decimal integer, a hexadecimal value such as 0xCBA07D86, or a password string.", "Password strings are converted through CRC32 to follow MakeZFS behavior."]}
    ],
    notes: ["For encrypted/compressed files the tool follows the archive's expected decompression/XOR handling order.", "The project is GPL-2.0 because it incorporates the LZO library/bridge components; see the repository for licensing details."]
  },
  "psp-extractor": {
    name: "BZ PSP Extractor",
    category: "PSP asset extraction",
    repo: "Battlezone_PSPExtractor",
    tagline: "Extract textures, geometry, audio, levels, movies, tables, and font data from Battlezone PSP assets or an ISO.",
    overview: "BZ PSP Extractor wraps the project's individual extraction scripts in a single desktop application. It can work directly from a PSP ISO, cache the USRDIR contents, and run focused extraction jobs or the full extraction sequence.",
    features: ["Direct ISO support", "Texture extraction", "RWS geometry extraction", "Audio extraction", "Level-package/JSON extraction", "Movie extraction/probing/transcoding", "Data-table and font-metric extraction", "Run-one or run-all workflow", "Windows/macOS/Linux build automation"],
    requirements: ["Python 3.12+ on Windows when running from source", "Pillow and pycdlib from requirements.txt", "FFmpeg/ffprobe for movie probe/transcode modes"],
    sourceRun: "python -m pip install -r requirements.txt\npython app\\bzpsp_gui.py",
    workflows: [
      {title: "Extract directly from an ISO", steps: ["Launch the GUI and select the Battlezone PSP ISO as input.", "Choose an output root.", "Let the app extract/cache PSP_GAME/USRDIR automatically.", "Run the specific asset tasks you need, or Run All for a complete pass."]},
      {title: "Extract selected asset types", steps: ["Choose an already-extracted PSP data root if you do not need ISO handling.", "Select texture, geometry, audio, level, movie, table, or font-metric processing.", "Run the task and monitor the live log for status/errors.", "Review results in the selected output root."]},
      {title: "Handle movies", steps: ["Use copy mode when you only need the original movie stream/files.", "Use probe/transcode/all modes only when FFmpeg and ffprobe are available.", "Review the output and logs after processing."]}
    ],
    notes: ["The packaged builds can bundle FFmpeg/ffprobe; source runs need those binaries available for movie operations that require them.", "Input and output roots are selected in the GUI; the tool does not depend on the original developer workspace paths."]
  },
  "gold-extractor": {
    name: "Battlezone Gold Extractor",
    category: "Asura reverse engineering",
    repo: "Battlezone_Gold_Extractor",
    tagline: "Research and extract Battlezone Gold Edition's Asura-engine archives, textures, models, and audio.",
    overview: "Battlezone Gold Extractor is both a reverse-engineering workspace and a unified extraction toolkit for Battlezone Gold Edition (2017). It documents discovered Asura container/asset structures and provides CLI/UI pipelines for archive extraction plus texture, model, and audio conversion.",
    features: ["Asura archive/container research and documentation", "Unified extractor entry point", "Archive extraction", "Texture discovery/conversion", "Model extraction/conversion", "Audio discovery/dump", "Combined multi-task pipelines", "Desktop UI wrapper", "Standalone Windows build workflow"],
    requirements: ["Python 3.x for source workflows", "Runtime conversion tools such as FFmpeg/texconv/QuickBMS may be used depending on the selected pipeline", "See the repository documentation for third-party licensing when redistributing packaged builds"],
    sourceRun: "python .\\tools\\bzg-extractor.py --help\npython .\\tools\\bzg-extractor-ui.py",
    workflows: [
      {title: "Use the desktop UI", steps: ["Launch tools/bzg-extractor-ui.py or download the packaged release.", "Select the Battlezone Gold source/game root and output workspace.", "Choose archive, texture, model, and/or audio tasks.", "Run the pipeline and review generated reports/logs alongside extracted assets."]},
      {title: "Run the unified CLI", steps: ["Start with bzg-extractor.py --help.", "Use extract for archive extraction, textures for texture conversion, models for geometry extraction, or audio for audio dumping.", "Use run with a comma-separated task set when you want one combined pipeline.", "Keep reports/logs with the output so reverse-engineering results are reproducible."]}
    ],
    notes: ["The repository is an active reverse-engineering workspace; format understanding and extraction coverage can evolve over time.", "The project documentation includes ASURA_FORMATS.md for the current technical baseline."]
  }
};