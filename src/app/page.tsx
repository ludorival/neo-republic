'use client'
import React from 'react'
import { Program } from '@/types/program'
import ProgramsList from './components/ProgramsList'
import Layout from './components/Layout'

type HomeProps = {
  programs?: Program[]
}

const Home = ({ programs = [] }: HomeProps) => {
  return (
    <Layout>
      <ProgramsList programs={programs} />
    </Layout>
  )
}

export default Home
