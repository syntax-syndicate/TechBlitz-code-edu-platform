import fs from 'fs';
import path from 'path';
import { processMDX } from '../mdx';

const POSTS_PATH = path.join(process.cwd(), 'src/app/(marketing)/blog/posts');

export const getBlogPosts = async () => {
  // create directory if it doesn't exist
  if (!fs.existsSync(POSTS_PATH)) {
    console.log('Creating blog posts directory');
    //fs.mkdirSync(POSTS_PATH, { recursive: true });
    // return empty array if no posts exist yet
    return [];
  }

  const files = fs.readdirSync(POSTS_PATH);

  // return empty array if no posts exist yet
  if (files.length === 0) {
    return [];
  }

  const posts = await Promise.all(
    files
      .filter((filename) => filename.endsWith('.mdx'))
      .map(async (filename) => {
        const filePath = path.join(POSTS_PATH, filename);
        const content = fs.readFileSync(filePath, 'utf8');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { content: _, frontmatter } = await processMDX(content);

        return {
          slug: filename.replace('.mdx', ''),
          date: frontmatter.date as string,
          featured: frontmatter.featured as boolean,
          image: frontmatter.image as string,
          description: frontmatter.description as string,
          title: frontmatter.title as string,
          subpage: frontmatter.subpage as boolean,
          author: frontmatter.author as string,
          ...frontmatter,
        };
      })
  );

  // Filter out subpages and unpublished posts in production
  const filteredPosts = posts.filter((post: any) => {
    if (process.env.NODE_ENV === 'production') {
      return post.status !== 'unpublished' && !post.subpage;
    }
    return !post.subpage; // Always filter out subpages, even in development
  });

  return filteredPosts.sort((a: any, b: any) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  });
};

export const getBlogPost = async (slug: string) => {
  const filePath = path.join(POSTS_PATH, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Blog post not found: ${slug}`);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  return processMDX(content);
};

export function getAllUniqueTags(posts: any[]): string[] {
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.tags?.forEach((tag: string) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export function filterPostsByTags(posts: any[], tags: string[]): any[] {
  if (!tags.length) return posts;
  return posts.filter((post) => tags.every((tag) => post.tags?.includes(tag)));
}
