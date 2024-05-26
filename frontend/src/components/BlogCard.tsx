interface BlogCardProps {
    authorName: string,
    title: string;
    content: string;
    publishedDate: string;
}

const BlogCard = ({
    authorName,
    content,
    publishedDate,
    title
}: BlogCardProps) => {
  return (
    <div>
        <div> {authorName} . {publishedDate}</div>
        <div>{title}</div>
        <div>{content.length > 100 ? content.slice(0,100) + "..." : content}</div>
        <div>{`${Math.ceil(content.length / 100)} minutes`}</div>
    </div>
  )
}

export default BlogCard