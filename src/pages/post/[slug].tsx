import { GetStaticPaths, GetStaticProps } from 'next';

import Prismic from '@prismicio/client';

import Head from 'next/head';

import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import styles from './post.module.scss';
import { getPrismicClient } from '../../services/prismic';
import { dateFormater } from '../../utils/DateFormater';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

const wordLengthTrimmer = (phrase: string) => phrase.trim().split(/\s+/).length;

export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router.isFallback) return <h1>Carregando...</h1>;

  const bodyContent = post.data.content.reduce((_total, current) => {
    const headingSize = wordLengthTrimmer(current.heading);

    const bodySize = current.body.reduce(
      (_totalBodyCount, currentBodyCount) =>
        _totalBodyCount + wordLengthTrimmer(currentBodyCount.text),
      0
    );

    return _total + headingSize + bodySize;
  }, 0);

  const readingTime = Math.ceil(bodyContent / 200);

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling.</title>
      </Head>

      <article className={styles.post}>
        <section className={styles.postBannerContainer}>
          <img
            src={`${post.data.banner.url}`}
            alt="aticle banner"
            className={styles.postBannerImage}
          />
        </section>
        <section className={styles.postContentContainer}>
          <div className={styles.postContentTitleContainer}>
            <h1 className={styles.postContentTitle}>{post.data.title}</h1>
          </div>
          <div className={styles.postContentInfoContainer}>
            <div className={styles.postContentInfo}>
              <time>{dateFormater(post.first_publication_date)}</time>
            </div>
            <div className={styles.postContentInfo}>
              <p>{post.data.author}</p>
            </div>
            <div className={styles.postContentInfo}>
              <p> {readingTime} min</p>
            </div>
          </div>
        </section>
        {post.data.content.map(content => (
          <section key={content.heading} className={styles.postContent}>
            <div className={styles.postContentHeadingContainer}>
              <h2 className={styles.postContentHeading}>{content.heading}</h2>
            </div>
            <div
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: RichText.asHtml(content.body),
              }}
              className={styles.postContentBody}
            />
          </section>
        ))}
      </article>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'posts'),
  ]);

  const paths = posts.results.map(post => ({
    params: {
      slug: post.uid,
    },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const { slug } = context.params;
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: { url: response.data.banner.url },
      author: response.data.author,
      content: response.data.content.map(content => ({
        heading: content.heading,
        body: [...content.body],
      })),
    },
  };

  return {
    props: { post },
    redirect: 60 * 30,
  };
};
