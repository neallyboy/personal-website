import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { cache } from "react";

type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
};

type Metadata = {
  title: string;
  navTitle?: string;
  subtitle?: string;
  publishedAt: string;
  dateModified?: string;
  howToSteps?: string[];
  summary: string;
  image?: string;
  images: string[];
  tag?: string;
  team: Team[];
  link?: string;
  internal?: boolean;
  hidden?: boolean;
};

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    notFound();
  }

  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  const metadata: Metadata = {
    title: data.title || "",
    navTitle: data.navTitle || undefined,
    subtitle: data.subtitle || "",
    publishedAt: data.publishedAt,
    dateModified: data.dateModified || undefined,
    howToSteps: data.howToSteps || undefined,
    summary: data.summary || "",
    image: data.image || "",
    images: data.images || [],
    tag: data.tag || [],
    team: data.team || [],
    link: data.link || "",
    internal: data.internal || false,
    hidden: data.hidden || false,
  };

  return { metadata, content };
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

// cache() deduplicates repeated calls with the same path within a single
// server render pass — prevents redundant fs.readdir / fs.readFile calls
// when Projects and Posts are composed on the same page.
export const getPosts = cache(function getPosts(customPath = ["", "", "", ""]) {
  const postsDir = path.join(process.cwd(), ...customPath);
  return getMDXData(postsDir);
});
