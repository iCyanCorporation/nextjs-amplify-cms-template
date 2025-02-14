import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = (await params).id

  // fetch data
  //   const product = await fetch(`https://.../${id}`).then((res) => res.json())

  // optionally access and extend (rather than replace) parent metadata
  //   const previousImages = (await parent).openGraph?.images || []

  return {
    title: "Blog Detail", // product.title
    description: "This is the blog detail page.",
  }
}

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (children);
}
