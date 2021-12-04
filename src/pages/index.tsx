import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { FiUser, FiCalendar } from 'react-icons/fi';
import { useState } from 'react';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';

import styles from './home.module.scss';
import { dateFormater } from '../utils/DateFormater';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const formatedPosts = postsPagination.results.map(post => ({
    ...post,
    first_publication_date: dateFormater(post.first_publication_date),
  }));

  const [posts, setposts] = useState<Post[]>(formatedPosts);
  const [nextPostPage, setnextPostPage] = useState<string>(
    postsPagination.next_page
  );

  async function handleLoadMorePosts(): Promise<void> {
    const newPostsPaginationProps = await fetch(nextPostPage).then(response =>
      response.json()
    );

    setnextPostPage(newPostsPaginationProps.next_page);

    const newPosts = newPostsPaginationProps.results.map(post => {
      return {
        ...post,
        first_publication_date: dateFormater(post.first_publication_date),
      };
    });

    setposts([...posts, ...newPosts]);
  }

  return (
    <>
      <Head>
        <title>spacetravelling.</title>
      </Head>

      <main className={styles.homeMainContainer}>
        <ul className={styles.postPreviewList}>
          {posts.map(post => (
            <li className={styles.postPreviewContainer} key={post.uid}>
              <Link href={`/post/${post.uid}`}>
                <a className={styles.postPreviewContent}>
                  <h2 className={styles.postPreviewTitle}>{post.data.title}</h2>
                  <p className={styles.postPreviewText}>{post.data.subtitle}</p>
                  <div className={styles.postPreviewInfo}>
                    <div className={styles.postPreviewDate}>
                      <FiCalendar />
                      <time>{post.first_publication_date}</time>
                    </div>
                    <div className={styles.postPreviewAuthorInfo}>
                      <FiUser />
                      <p>{post.data.author}</p>
                    </div>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>

        {nextPostPage && (
          <div className={styles.loadPostsContainer}>
            <div className={styles.loadPostsButtonContainer}>
              <button
                className={styles.loadPostsButton}
                type="button"
                onClick={handleLoadMorePosts}
              >
                Carregar mais posts
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
    }
  );

  const posts = postsResponse.results.map(post => ({
    uid: post.uid,
    first_publication_date: post.first_publication_date,
    data: {
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
    },
  }));

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  return {
    props: {
      postsPagination,
    },
  };
};
