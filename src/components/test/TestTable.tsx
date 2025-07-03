"use client";
// This is a test whit React Query fetching Data
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFirstNWords } from "@/utils/helpers";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

async function fetchPosts(): Promise<Post[]> {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  return response.json();
}

function TestTable() {
  const {
    isLoading,
    error,
    data: posts,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>User Id</TableHead>
            <TableHead>Post Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Body</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts?.map((post, key) => (
            <TableRow key={key}>
              <TableCell>{post.userId}</TableCell>
              <TableCell>{post.id}</TableCell>
              <TableCell>{post.title}</TableCell>
              <TableCell>{getFirstNWords(post.body, 5)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default TestTable;
