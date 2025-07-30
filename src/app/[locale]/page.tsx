import { useTranslations } from 'next-intl';
import styles from './page.module.scss';
import { Link } from '@/i18n/navigation';

export default function Home() {
  const t = useTranslations('pages.home.introduction');
  return (
    <main>
      <h1 className={styles.h1}>{t('main-title')}</h1>
      <Link href="/about">{t('about')}</Link>
    </main>
  );
}
