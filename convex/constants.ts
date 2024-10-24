import {
  type RemixiconComponentType,
  RiAccountCircleFill,
  RiAppleFill,
  RiAtLine,
  RiAuctionFill,
  RiAwardFill,
  RiBankCardFill,
  RiBankFill,
  RiBasketballFill,
  RiBlueskyFill,
  RiBuildingFill,
  RiCakeFill,
  RiCalendarLine,
  RiCapsuleFill,
  RiCarFill,
  RiChat1Fill,
  RiCheckboxLine,
  RiChromeFill,
  RiCodeFill,
  RiCommunityFill,
  RiContactsBookFill,
  RiDiscordFill,
  RiDropboxFill,
  RiDropdownList,
  RiFacebookCircleFill,
  RiFileFill,
  RiFlowerFill,
  RiFolder2Fill,
  RiGithubFill,
  RiGlobalFill,
  RiGoogleFill,
  RiGovernmentFill,
  RiGraduationCapFill,
  RiHandHeartFill,
  RiHashtag,
  RiHeartFill,
  RiHomeFill,
  RiHospitalFill,
  RiIdCardFill,
  RiImageFill,
  RiInputField,
  RiInstagramFill,
  RiKeyFill,
  RiLightbulbFill,
  RiLinkedinFill,
  RiLock2Fill,
  RiMailFill,
  RiMediumFill,
  RiMentalHealthFill,
  RiMusic2Fill,
  RiNewsFill,
  RiParagraph,
  RiPatreonFill,
  RiPhoneFill,
  RiPhoneLine,
  RiPinterestFill,
  RiPlantFill,
  RiPlaystationFill,
  RiPoliceBadgeFill,
  RiRedditFill,
  RiRestaurantFill,
  RiRobot2Fill,
  RiScales3Fill,
  RiSchoolFill,
  RiSettings3Fill,
  RiShapesFill,
  RiShieldUserFill,
  RiSignpostFill,
  RiSlackFill,
  RiSmartphoneFill,
  RiSnapchatFill,
  RiSofaFill,
  RiSoundcloudFill,
  RiSparklingFill,
  RiSpotifyFill,
  RiStore2Fill,
  RiSwitchFill,
  RiSwordFill,
  RiTeamFill,
  RiTentFill,
  RiTiktokFill,
  RiToothFill,
  RiTrophyFill,
  RiTv2Fill,
  RiTwitterXFill,
  RiUserFill,
  RiWalletFill,
  RiWhatsappFill,
  RiWindowsFill,
  RiYoutubeFill,
} from "@remixicon/react";

export const ICONS: Record<string, RemixiconComponentType> = {
  account: RiAccountCircleFill,
  bank: RiBankFill,
  basketball: RiBasketballFill,
  building: RiBuildingFill,
  cake: RiCakeFill,
  car: RiCarFill,
  certificate: RiAwardFill,
  chat: RiChat1Fill,
  code: RiCodeFill,
  college: RiGraduationCapFill,
  community: RiCommunityFill,
  contacts: RiContactsBookFill,
  creditCard: RiBankCardFill,
  file: RiFileFill,
  flower: RiFlowerFill,
  folder: RiFolder2Fill,
  food: RiRestaurantFill,
  gavel: RiAuctionFill,
  giving: RiHandHeartFill,
  global: RiGlobalFill,
  government: RiGovernmentFill,
  heart: RiHeartFill,
  home: RiHomeFill,
  hospital: RiHospitalFill,
  id: RiIdCardFill,
  image: RiImageFill,
  key: RiKeyFill,
  lightbulb: RiLightbulbFill,
  lock: RiLock2Fill,
  mail: RiMailFill,
  mentalHealth: RiMentalHealthFill,
  music: RiMusic2Fill,
  news: RiNewsFill,
  phone: RiPhoneFill,
  pill: RiCapsuleFill,
  plant: RiPlantFill,
  police: RiPoliceBadgeFill,
  robot: RiRobot2Fill,
  scale: RiScales3Fill,
  school: RiSchoolFill,
  settings: RiSettings3Fill,
  shapes: RiShapesFill,
  signpost: RiSignpostFill,
  smartphone: RiSmartphoneFill,
  socialSecurity: RiShieldUserFill,
  sofa: RiSofaFill,
  sparkles: RiSparklingFill,
  store: RiStore2Fill,
  sword: RiSwordFill,
  team: RiTeamFill,
  tent: RiTentFill,
  tooth: RiToothFill,
  trophy: RiTrophyFill,
  tv: RiTv2Fill,
  user: RiUserFill,
  wallet: RiWalletFill,

  // Logos
  apple: RiAppleFill,
  bluesky: RiBlueskyFill,
  chrome: RiChromeFill,
  discord: RiDiscordFill,
  dropbox: RiDropboxFill,
  facebook: RiFacebookCircleFill,
  github: RiGithubFill,
  google: RiGoogleFill,
  instagram: RiInstagramFill,
  linkedin: RiLinkedinFill,
  medium: RiMediumFill,
  patreon: RiPatreonFill,
  pinterest: RiPinterestFill,
  playstation: RiPlaystationFill,
  reddit: RiRedditFill,
  slack: RiSlackFill,
  snapchat: RiSnapchatFill,
  soundcloud: RiSoundcloudFill,
  spotify: RiSpotifyFill,
  switch: RiSwitchFill,
  tiktok: RiTiktokFill,
  twitter: RiTwitterXFill,
  whatsapp: RiWhatsappFill,
  windows: RiWindowsFill,
  youtube: RiYoutubeFill,
} as const;
export type Icon = keyof typeof ICONS;

export const JURISDICTIONS = {
  AK: "Alaska",
  AL: "Alabama",
  AR: "Arkansas",
  AZ: "Arizona",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DC: "District of Columbia",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  IA: "Iowa",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  MA: "Massachusetts",
  MD: "Maryland",
  ME: "Maine",
  MI: "Michigan",
  MN: "Minnesota",
  MO: "Missouri",
  MS: "Mississippi",
  MT: "Montana",
  NC: "North Carolina",
  ND: "North Dakota",
  NE: "Nebraska",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NV: "Nevada",
  NY: "New York",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  PR: "Puerto Rico",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VA: "Virginia",
  VT: "Vermont",
  WA: "Washington",
  WI: "Wisconsin",
  WV: "West Virginia",
  WY: "Wyoming",
} as const;
export type Jurisdiction = keyof typeof JURISDICTIONS;

interface FieldDetails {
  label: string;
  icon: RemixiconComponentType;
}
export const FIELDS: Record<string, FieldDetails> = {
  text: {
    label: "Text",
    icon: RiInputField,
  },
  textarea: {
    label: "Textarea",
    icon: RiParagraph,
  },
  date: {
    label: "Date",
    icon: RiCalendarLine,
  },
  select: {
    label: "Select",
    icon: RiDropdownList,
  },
  checkbox: {
    label: "Checkbox",
    icon: RiCheckboxLine,
  },
  number: {
    label: "Number",
    icon: RiHashtag,
  },
  email: {
    label: "Email",
    icon: RiAtLine,
  },
  phone: {
    label: "Phone",
    icon: RiPhoneLine,
  },
} as const;
export type Field = keyof typeof FIELDS;

export const THEMES = {
  system: "System",
  light: "Light",
  dark: "Dark",
} as const;
export type Theme = keyof typeof THEMES;

export const ROLES = {
  user: "User",
  editor: "Editor",
  admin: "Admin",
} as const;
export type Role = keyof typeof ROLES;

export const SORT_QUESTS_BY = {
  newest: "Newest",
  oldest: "Oldest",
} as const;
export type SortQuestsBy = keyof typeof SORT_QUESTS_BY;
