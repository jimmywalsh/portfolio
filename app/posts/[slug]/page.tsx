import { CalendarDays, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useMDXComponent } from 'next-contentlayer/hooks'

import fetchPosts from '../fetchPosts'

import { Tag } from './tag'

import { Post } from '@/.contentlayer/generated'
import { Time } from '@/components/custom/time'
import { mdxComponents } from '@/components/mdx-components'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { buttonVariants } from '@/components/ui/button'
import { TypographyH1 } from '@/components/ui/typography'
import { calculateTimeToRead } from '@/helpers'
import { cn } from '@/lib/utils'

const allPosts = fetchPosts()

export const generateStaticParams = async () => allPosts.map((post) => ({ slug: post._raw.flattenedPath }))

export const generateMetadata = ({ params }: { params: { slug: string } }): Metadata => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug)
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`)

  return {
    title: post.title,
    description: post.brief,
    openGraph: {
      description: post.brief,
      images: [post.coverImage],
      type: 'article',
    },
  }
}

interface PostPageProps {
  params: { slug: string }
}

function getPostBySlug(slug: string): Post {
  const post = allPosts.find((post) => post._raw.flattenedPath === slug)
  if (!post) throw new Error(`Post not found for slug: ${slug}`)

  return post
}

function getPreviousPost(slug: string): Post | undefined {
  const postIndex = allPosts.findIndex((post) => post._raw.flattenedPath === slug)

  if (postIndex === allPosts.length - 1) return undefined

  return allPosts[postIndex + 1]
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug)
  const previousPost = getPreviousPost(params.slug)
  const MDXContent = useMDXComponent(post.body.code)

  return (
    <div className="py-8 md:px-24">
      <AspectRatio ratio={16 / 9}>
        <Image src={post.coverImage} alt="Article cover image" className="rounded-xl " priority fill />
      </AspectRatio>
      <TypographyH1>{post.title}</TypographyH1>
      <div className="flex w-full flex-col gap-4">
        <span className="flex flex-row px-2 text-lg font-medium">
          <CalendarDays width={24} height={24} />
          <Time dateTime={post.publishedAt} />
          <span className="ml-2 flex flex-row gap-1">
            <Clock width={24} height={24} />
            {calculateTimeToRead(post.body.raw)}&nbsp;min read
          </span>
        </span>
        <span className="flex flex-row gap-2">
          {post.tags.map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
        </span>
      </div>
      <article>
        <MDXContent components={mdxComponents} />
      </article>
      <div className="border-color mt-8 flex w-full flex-row justify-between gap-6 border-t pt-8">
        <Link href="/posts" className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
          <ChevronLeft width={16} height={16} />
          &nbsp;All posts
        </Link>
        {!!previousPost && (
          <Link href={previousPost.url} className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
            <ChevronRight width={16} height={16} />
            &nbsp;Next
          </Link>
        )}
      </div>
    </div>
  )
}
