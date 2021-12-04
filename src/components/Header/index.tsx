import Image from 'next/image';
import Link from 'next/link';
import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/">
          <Image src="/images/logo.svg" alt="logo" width="55" height="30" />
        </Link>
        <h1 className={styles.title}>spacetraveling</h1>
        <h1 className={styles.dot}>.</h1>
      </div>
    </header>
  );
}
