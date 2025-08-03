import { Metadata } from "next";

export function generatePageMetadata(
  title: string,
  description: string,
  options?: {
    noIndex?: boolean;
    openGraph?: {
      title?: string;
      description?: string;
      type?: string;
      image?: string;
    };
  }
): Metadata {
  const baseMetadata: Metadata = {
    title: title.endsWith(" - SmartRec") ? title : `${title} - SmartRec`,
    description,
    robots: options?.noIndex ? "noindex, nofollow" : "index, follow",
  };

  if (options?.openGraph) {
    baseMetadata.openGraph = {
      title: options.openGraph.title || title,
      description: options.openGraph.description || description,
      type: options.openGraph.type || "website",
      ...(options.openGraph.image && { images: [options.openGraph.image] }),
    };
  }

  return baseMetadata;
}

export function generateRecordingMetadata(recording: {
  title: string;
  description?: string;
  thumbnail?: string;
}): Metadata {
  return generatePageMetadata(
    recording.title,
    recording.description || `Watch "${recording.title}" - Screen recording shared with you`,
    {
      openGraph: {
        title: recording.title,
        description: recording.description || `Watch "${recording.title}"`,
        type: "video.other",
        image: recording.thumbnail,
      },
    }
  );
}

export function generateBlogPostMetadata(post: {
  title: string;
  excerpt: string;
  publishedAt: string;
  author: string;
  slug: string;
}): Metadata {
  return generatePageMetadata(
    post.title,
    post.excerpt,
    {
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
      },
    }
  );
} 