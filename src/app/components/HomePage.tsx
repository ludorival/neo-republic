'use client'
import React from 'react'
import { Program } from '@/types/program'
import ProgramsList from './ProgramsList'

type HomePageProps = {
  programs?: Program[]
}

export default function HomePage({ programs = [] }: HomePageProps) {
  return (
    <>
      <ProgramsList programs={programs} />
    </>
  )
} 