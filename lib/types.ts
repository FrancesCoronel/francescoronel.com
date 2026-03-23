export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  featuredImage: string;
  categories: string[];
  tags: string[];
  organizations: string[];
  skills: string[];
  externalUrl?: string;
  source?: "webflow" | "wordpress";
  readingTime: string;
  content: string;
}

export interface BlogPostFrontmatter {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  featuredImage: string;
  categories: string[];
  tags: string[];
  organizations: string[];
  skills: string[];
  externalUrl?: string;
  source?: "webflow" | "wordpress";
  draft?: boolean;
}

export interface Testimonial {
  name: string;
  slug: string;
  role: string;
  organization: string;
  quote: string;
  image: string;
  featured: boolean;
}

export interface Organization {
  name: string;
  slug: string;
  logo: string;
  url: string;
  type: "employer" | "conference" | "community" | "education" | "media";
  description: string;
}

export interface Skill {
  name: string;
  slug: string;
  category: string;
  icon: string;
  proficiency: number;
}

export interface Award {
  title: string;
  slug: string;
  organization: string;
  date: string;
  description: string;
  image: string;
  url: string;
}

export interface WorkExperience {
  title: string;
  slug: string;
  company: string;
  companyLogo: string;
  companyUrl: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  highlights: string[];
  skills: string[];
  type?: "employment" | "project";
}

export interface Education {
  institution: string;
  slug: string;
  degree: string;
  field: string;
  logo: string;
  url: string;
  startDate: string;
  endDate: string;
  description: string;
  honors: string[];
}

export interface Category {
  name: string;
  slug: string;
  color: string;
  fontColor?: string;
  emoji?: string;
  image?: string;
  description: string;
  count?: number;
}

export interface Tag {
  name: string;
  slug: string;
  count?: number;
}

export interface Project {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  highlights: string[];
  skills: string[];
  logo: string;
  emoji?: string;
  url: string;
  startDate: string;
  endDate: string | null;
  category: "open-source" | "podcast" | "hackathon" | "work-project" | "side-project";
  status?: "active" | "complete" | "abandoned" | "archived";
  github?: string;
  blogSlug?: string;
  organization?: string;
}

/** Unified post type — covers both blog posts and projects */
export interface Post extends BlogPost {
  postType: "post" | "project";
  // Project-specific fields (only set when postType === 'project')
  tagline?: string;
  highlights?: string[];
  logo?: string;
  emoji?: string;
  projectUrl?: string;
  startDate?: string;
  endDate?: string | null;
  projectCategory?: "open-source" | "podcast" | "hackathon" | "work-project" | "side-project";
  status?: "active" | "complete" | "abandoned" | "archived";
  github?: string;
  organization?: string;
}

export interface SiteMetadata {
  title: string;
  description: string;
  siteUrl: string;
  author: string;
  social: {
    twitter: string;
    github: string;
    linkedin: string;
  };
}
