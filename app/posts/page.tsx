import { css } from 'styled-system/css'
import { hstack, container } from 'styled-system/patterns'
import Link from 'next/link'
import { compareDesc } from 'date-fns'
import { Post, allPosts } from 'contentlayer/generated'
import Image from 'next/image'

import { PageLayout } from '@ui/Layouts'
import { TimeFormat } from '@ui/TimeFormat'
import { Timeline } from '@ui/Timeline'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { Card } from '@ui/Card'

const articleTitleStyles = css({
  fontSize: 'xl',
  fontWeight: 'semibold',
})
const coverImageSmallContainer = container({
  height: '120px',
  width: '264px',
  marginInline: 0,
  my: '1rem',
})
const coverImageSmall = css({
  objectFit: 'cover',
  borderRadius: 'md',
})
const articleBriefStyles = css({
  fontSize: 'md',
})
const linkBlurb = hstack({
  gap: 1,
  color: 'blue.600',
  fontWeight: 'semibold',
  fontSize: 'md',
  _hover: {
    color: 'blue.500',
  },
})

function getAllPosts(): Post[] {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)))
  return posts
}

export const metadata = {
  title: 'Articles - James Walsh',
  description: `Articles I've written`,
}

export default function PostsIndexPage() {
  const posts = getAllPosts()

  return (
    <>
      <PageLayout.Title align="left">Articles about web development.</PageLayout.Title>
      <PageLayout.Content>
        <Timeline>
          {posts.map((post) => (
            <Timeline.Item key={post.title}>
              <Timeline.LeftElement>
                <div className={css({ ml: '1rem' })}>
                  <TimeFormat size="sm" dateTime={post.publishedAt} />
                </div>
              </Timeline.LeftElement>
              <Timeline.RightElement>
                <Link href={post.url} className={css({ width: '100%' })}>
                  <Card variant="ghost">
                    <h2 className={articleTitleStyles}>{post.title}</h2>
                    <Card.Body>
                      <p className={articleBriefStyles}>{post.brief}</p>
                      <div className={coverImageSmallContainer}>
                        <Image
                          className={coverImageSmall}
                          src={post.coverImage}
                          alt={`${post.title} cover image`}
                          fill
                        />
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <span className={linkBlurb}>
                        Read Full Article <ChevronRightIcon width={20} height={20} />
                      </span>
                    </Card.Footer>
                  </Card>
                </Link>
              </Timeline.RightElement>
            </Timeline.Item>
          ))}
        </Timeline>
      </PageLayout.Content>
    </>
  )
}
