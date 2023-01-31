import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useInfiniteQuery } from 'react-query';

// Components
import ErrorCard from './ErrorCard';
import LoadingCard from './LoadingCard';

// Helpers
import RAWG from '../lib/rawg';

// Assets
import placeholderImg from '../public/assets/placeholder.avif';

// Hooks
import useUser from '../hooks/useUser';
import useUserBookmarks from '../hooks/useUserBookmarks';
import useBookmarkMutation from '../hooks/useBookmarkMutation';

// Types
import { GameInterface } from '../lib/types/game';

interface Games {
  results: GameInterface[];
}

const fetchGames = async ({ pageParam = 1 }): Promise<GameInterface[]> => {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  const { data } = await RAWG.get<Games>(
    `/games/lists/main?key=${apiKey}&ordering=-released&page_size=10&page=${pageParam}`
  );

  return data?.results;
};

export default function TrendingGamesList() {
  const router = useRouter();
  const { currentUser } = useUser();
  const { bookmarksData } = useUserBookmarks();
  const { handleAddBookmark } = useBookmarkMutation();

  const {
    data: games,
    isError,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(['getTrendingGames'], fetchGames, {
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 40) return undefined;

      if (allPages.length) return allPages.length + 1;

      return undefined;
    },
  });

  const handleClick = (details: GameInterface) => {
    if (!currentUser) return router.push('/bookmarks');

    return handleAddBookmark(bookmarksData, details);
  };

  if (isLoading) return <LoadingCard size={5} isHorizontal />;

  if (isError) return <ErrorCard />;

  return (
    <>
      <span className="mb-4 inline-block text-h1">New and upcoming games</span>

      <ul className="grid snap-x snap-proximity grid-flow-col items-center gap-4 overflow-x-scroll">
        {games?.pages.map((page) =>
          page.map((details) => (
            <li key={details.slug} className="snap-start">
              <div className="relative h-full w-72 max-w-xl overflow-hidden rounded-lg">
                <Image
                  src={details.background_image || placeholderImg}
                  alt={details.name}
                  width={200}
                  height={200}
                  className="h-48 w-full object-cover object-top"
                />

                <div className="absolute bottom-0 w-full py-4 px-3 backdrop-blur-md backdrop-filter">
                  <div className="flex items-center justify-between gap-6">
                    <Link
                      href={`/game/${details.slug}`}
                      className="truncate text-ellipsis border-b border-b-transparent text-body-1 font-medium transition-all duration-100 hover:border-b hover:border-b-secondary"
                    >
                      {details.name}
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleClick(details)}
                      className="flex w-fit items-center justify-center gap-1 text-body-1"
                    >
                      Add
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))
        )}

        <li className="h-full">
          <button
            type="button"
            disabled={!hasNextPage || isFetchingNextPage}
            onClick={() => hasNextPage && fetchNextPage()}
            className="h-full rounded-md bg-primary-light px-6 py-2 text-white"
          >
            {/* eslint-disable-next-line no-nested-ternary */}
            {isFetchingNextPage
              ? 'Loading more...'
              : hasNextPage
              ? 'Load More'
              : 'Nothing more to load'}
          </button>
        </li>
      </ul>
    </>
  );
}
