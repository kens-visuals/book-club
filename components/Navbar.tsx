import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Components
import Drawer from './Drawer';

export default function Navbar() {
  const { pathname } = useRouter();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => setIsDrawerOpen(false), [pathname]);

  const handleDrawerClick = () =>
    setIsDrawerOpen((drawerState) => !drawerState);

  const routes = [
    {
      path: '/',
      icon: (
        <path
          fillRule="evenodd"
          d="M1.5 7.125c0-1.036.84-1.875 1.875-1.875h6c1.036 0 1.875.84 1.875 1.875v3.75c0 1.036-.84 1.875-1.875 1.875h-6A1.875 1.875 0 011.5 10.875v-3.75zm12 1.5c0-1.036.84-1.875 1.875-1.875h5.25c1.035 0 1.875.84 1.875 1.875v8.25c0 1.035-.84 1.875-1.875 1.875h-5.25a1.875 1.875 0 01-1.875-1.875v-8.25zM3 16.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875v2.25c0 1.035-.84 1.875-1.875 1.875h-5.25A1.875 1.875 0 013 18.375v-2.25z"
          clipRule="evenodd"
        />
      ),
    },
    {
      path: '/bookmarks',
      icon: (
        <path
          fillRule="evenodd"
          d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
          clipRule="evenodd"
        />
      ),
    },
    {
      path: '/collections',
      icon: (
        <path d="M19.906 9c.382 0 .749.057 1.094.162V9a3 3 0 00-3-3h-3.879a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H6a3 3 0 00-3 3v3.162A3.756 3.756 0 014.094 9h15.812zM4.094 10.5a2.25 2.25 0 00-2.227 2.568l.857 6A2.25 2.25 0 004.951 21H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-2.227-2.568H4.094z" />
      ),
    },
  ];

  return (
    <>
      {isDrawerOpen && <Drawer />}

      <nav className="fixed left-4 z-50 flex w-[calc(100vw_-_2rem)] items-center justify-between rounded-lg bg-primary-dark/50 p-4 backdrop-blur-2xl backdrop-filter md:left-6 md:h-[calc(100vh_-_2rem)] md:w-20 md:flex-col">
        <span className="rounded bg-secondary p-1 text-center font-outfit text-body-2 font-medium uppercase text-white">
          Game <br /> Zone
        </span>

        <ul className="flex items-center justify-between gap-4 md:flex-col">
          {routes.map((route) => (
            <li key={route.path}>
              <Link href={route.path}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`h-6 w-6 transition-all duration-300 ${
                    pathname === route.path
                      ? 'fill-white'
                      : 'fill-primary-light hover:fill-white'
                  }`}
                >
                  {route.icon}
                </svg>
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="hamburger"
          onClick={handleDrawerClick}
        >
          {/* Hamburger */}
          {isDrawerOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
      </nav>
    </>
  );
}
