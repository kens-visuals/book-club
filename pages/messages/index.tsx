import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

// Components
import Message from '../../components/Message';
import MessangerInput from '../../components/MessangerInput';
import MessangerUsers from '../../components/MessangerUsers';

// Hooks
import useFollow from '../../hooks/useFollow';
import useMessages from '../../hooks/useMessages';

// Interfaces
import { MessageType } from '../../lib/types/game';

export default function Messanger() {
  const { followList } = useFollow();

  const { getMessages, getMessagesStatus } = useMessages();

  const otherUsers = followList('following') || [];

  const [sendTo, setSendTo] = useState(otherUsers[0]?.uid || '');
  const [currentMessages, setCurrentMessages] = useState<MessageType[]>([]);
  const [messageLimit, setMessageLimit] = useState(50);
  const [unreadMessages, setUnreadMessages] = useState<MessageType[]>([]);

  const scrollRef = useRef<HTMLLIElement>(null);

  const otherUser = followList('following')
    ?.filter((user) => user.uid === sendTo)
    .at(0);

  useEffect(() => {
    if (!sendTo) return;

    const messagesCallback = (d: any) =>
      setCurrentMessages(
        d.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }))
      );

    const statusCallback = (d: any) =>
      setUnreadMessages(
        d.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }))
      );

    const statusUnsub = getMessagesStatus(sendTo, statusCallback, messageLimit);
    const messagesUnsub = getMessages(sendTo, messagesCallback, messageLimit);

    // eslint-disable-next-line consistent-return
    return () => {
      statusUnsub();
      messagesUnsub();
    };
  }, [sendTo, messageLimit]);

  return (
    <>
      <Head>
        <title>GZ | Messages</title>
        <meta name="description" content="List of messages and users" />
      </Head>

      <div className="lg:grid lg:grid-cols-[1fr_auto] lg:gap-4">
        <MessangerUsers
          sendTo={sendTo}
          setSendTo={setSendTo}
          unreadMessages={unreadMessages}
        />

        <div className="relative mt-4 h-full overflow-hidden rounded-lg bg-primary-dark lg:mt-0">
          <div className="flex items-center gap-2 border-b border-primary-light p-4 shadow-lg shadow-black/70">
            {otherUser && (
              <>
                <Link
                  href={`/user/${otherUser?.uid}`}
                  className="flex items-center gap-2"
                >
                  <Image
                    height={50}
                    width={50}
                    src={otherUser?.photoURL}
                    alt={otherUser?.displayName}
                    className="h-10 w-10 rounded-full"
                  />
                </Link>
                <span className="md:text-h2-medium">
                  {otherUser.displayName}
                </span>
              </>
            )}
          </div>

          <ul className="flex h-[calc(100vh_-_27rem)] flex-col-reverse gap-2 overflow-y-scroll p-4 md:h-[calc(100vh_-_10.7rem)]">
            {currentMessages.length > 0 ? (
              <>
                <li ref={scrollRef} className="mt-8 md:mt-12" />
                {currentMessages?.map((msg) => (
                  <Message key={msg.id} message={msg} />
                ))}
                <li
                  className={`flex w-fit items-center justify-center self-center rounded-md bg-primary-light px-4 py-2 ${
                    messageLimit > currentMessages.length && 'hidden'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setMessageLimit((prevState) => prevState + 25)
                    }
                  >
                    Load More
                  </button>
                </li>{' '}
              </>
            ) : (
              <li className="my-auto flex items-center justify-center">
                <span>No messages yet!</span>
              </li>
            )}
          </ul>

          <MessangerInput
            sendTo={sendTo}
            scrollRef={scrollRef}
            setUnreadMessages={setUnreadMessages}
          />
        </div>
      </div>
    </>
  );
}
