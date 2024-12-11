'use client'

import { useTranslations } from 'next-intl';
import { Button, Card, CardBody } from "@nextui-org/react";
import Image from "next/image";

export default function Home() {
  const t = useTranslations('common');

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Card>
          <CardBody>
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <p>{t('description')}</p>
          </CardBody>
        </Card>

        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Button
            color="primary"
            href="https://vercel.com/new"
            as="a"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('deploy')}
          </Button>
          
          <Button
            variant="bordered"
            href="https://nextjs.org/docs"
            as="a"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('readDocs')}
          </Button>
        </div>
      </main>
    </div>
  );
}
