import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchById } from "../../../lib/api";
import { NoteDetailsClient } from "./NoteDetailsClient";

type PageProps = {
  params: { id: string };
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const numId = Number(id);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", numId],
    queryFn: () => fetchById(numId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
};

export default Page;
