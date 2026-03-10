function Post({ week, subject }: { week: number; subject: string }) {
  const content = `Showing results for ${subject} - Week ${week}`;

  return <div>{content}</div>;
}

export default Post;
