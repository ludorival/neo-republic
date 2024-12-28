'use client'
import React from 'react'
import { Program } from '@/types/program'
import ProgramsList from './ProgramsList'
import Layout from './Layout'

type HomePageProps = {
  programs?: Program[]
}

export default function HomePage({ programs = [] }: HomePageProps) {
  return (
    <Layout>
      <ProgramsList programs={programs} />
    </Layout>
  )
} 