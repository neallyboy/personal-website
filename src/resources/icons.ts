import type { IconType } from "react-icons";

import {
  HiArrowRight,
  HiArrowTopRightOnSquare,
  HiArrowUpRight,
  HiCalendarDays,
  HiEnvelope,
  HiOutlineDocument,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineGlobeAsiaAustralia,
  HiOutlineLink,
  HiOutlineRocketLaunch,
} from "react-icons/hi2";

import {
  PiBookBookmarkDuotone,
  PiGridFourDuotone,
  PiHouseDuotone,
  PiImageDuotone,
  PiUserCircleDuotone,
} from "react-icons/pi";

import {
  SiFigma,
  SiJavascript,
  SiNetlify,
  SiNextdotjs,
  SiSupabase,
  SiTypescript,
} from "react-icons/si";

import {
  FaDiscord,
  FaDocker,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaReact,
  FaReddit,
  FaTelegram,
  FaThreads,
  FaWhatsapp,
  FaX,
  FaXTwitter,
  FaMicrosoft,
} from "react-icons/fa6";

import { VscAzure } from "react-icons/vsc";

import { DiMsqlServer } from "react-icons/di";

import { BoomiIcon, PowerAppsIcon, PowerPlatformIcon } from "./customIcons";

export const iconLibrary: Record<string, IconType> = {
  arrowUpRight: HiArrowUpRight,
  arrowRight: HiArrowRight,
  email: HiEnvelope,
  globe: HiOutlineGlobeAsiaAustralia,
  person: PiUserCircleDuotone,
  grid: PiGridFourDuotone,
  book: PiBookBookmarkDuotone,
  openLink: HiOutlineLink,
  calendar: HiCalendarDays,
  home: PiHouseDuotone,
  gallery: PiImageDuotone,
  discord: FaDiscord,
  eye: HiOutlineEye,
  eyeOff: HiOutlineEyeSlash,
  github: FaGithub,
  linkedin: FaLinkedin,
  x: FaX,
  twitter: FaXTwitter,
  threads: FaThreads,
  arrowUpRightFromSquare: HiArrowTopRightOnSquare,
  document: HiOutlineDocument,
  rocket: HiOutlineRocketLaunch,
  javascript: SiJavascript,
  nextjs: SiNextdotjs,
  supabase: SiSupabase,
  figma: SiFigma,
  typescript: SiTypescript,
  facebook: FaFacebook,
  pinterest: FaPinterest,
  whatsapp: FaWhatsapp,
  reddit: FaReddit,
  telegram: FaTelegram,
  instagram: FaInstagram,
  microsoft: FaMicrosoft,
  react: FaReact,
  docker: FaDocker,
  azure: VscAzure,
  netlify: SiNetlify,
  sqlServer: DiMsqlServer,
  boomi: BoomiIcon,
  powerApps: PowerAppsIcon,
  powerPlatform: PowerPlatformIcon,
};

export type IconLibrary = typeof iconLibrary;
export type IconName = keyof IconLibrary;
