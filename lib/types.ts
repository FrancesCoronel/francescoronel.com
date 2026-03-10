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
