import { Metadata } from "next";
import { blogPosts } from "@/lib/data/blog-posts";
import { generateBlogPostMetadata } from "@/lib/utils/metadata";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find(post => post.slug === params.slug);
  
  if (post) {
    return generateBlogPostMetadata(post);
  }

  return {
    title: "Blog Post - SmartRec",
    description: "Read the latest insights about screen recording",
  };
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 