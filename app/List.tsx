import Post from "./Post";

function List({ week, subject }: { week: number; subject: string }) {
  return <Post week={week} subject={subject} />;
}

export default List;
