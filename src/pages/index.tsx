import { GetStaticProps } from 'next';
import Head from 'next/head';

import { BsCalendarDate, BsPerson } from 'react-icons/bs';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';


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

export default function Home() {
  // TODO
  return (
    <>
      <Head>
        <title>spacetravelling.</title>
      </Head>

      <main className={styles.homeMainContainer}>
        <ul className={styles.postPreviewList}>
          <li className={styles.postPreviewContainer}>
            <div className={styles.postPreviewContent}>
              <h2 className={styles.postPreviewTitle}>Como utilizar hooks</h2>
              <p className={styles.postPreviewText}>
                Pensando em sincronização em vez de ciclos de vida.
              </p>
              <div className={styles.postPreviewInfo}>
                <div className={styles.postPreviewDate}>
                  <BsCalendarDate />
                  <time>15 mar 2021</time>
                </div>
                <div className={styles.postPreviewAuthorInfo}>
                  <BsPerson />
                  <p>Joseph Oliveira</p>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <div className={styles.loadPostsContainer}>
          <div className={styles.loadPostsButtonContainer}>
            <button className={styles.loadPostsButton} type="button">
              Carregar mais posts
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
