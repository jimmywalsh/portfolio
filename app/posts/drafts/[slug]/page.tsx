import formatDate from 'date-fns/format'
import { RocketIcon } from 'lucide-react'
import { RedirectType, redirect } from 'next/navigation'

import PostPage, { PostPageProps } from '../../[slug]/page'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { fetchPostBySlug, isPostReleased } from '@/lib/posts'

export default async function PostDraftPage(props: PostPageProps) {
  const post = fetchPostBySlug(props.params.slug)

  if (isPostReleased(post)) {
    redirect(`/posts/${props.params.slug}`, RedirectType.replace)
  }

  return (
    <>
      <Alert className="border-2 border-fuchsia-600">
        <RocketIcon className="h-4 w-4" />
        <AlertTitle className="mb-2">This article is unreleased</AlertTitle>
        <AlertDescription>
          <ul className="list-disc">
            <li>
              Status: <Badge variant="outline">{post.status}</Badge>
            </li>
            {!!post.publishedAt ? (
              <li>Will release on: {formatDate(new Date(post.publishedAt), 'MMM dd, yy')}</li>
            ) : (
              'No relase date'
            )}
          </ul>
        </AlertDescription>
      </Alert>
      <PostPage {...props} />
    </>
  )
}
