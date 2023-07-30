'use client'

import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import Proposal from '@/components/Proposal'
import { useSnapshotProposalData } from '@/hooks'
import { getCurrentTab, parseValidSnapshotProposalUrl } from '@/utils'

// const dummyUrl = 'https://snapshot.org/#/aave.eth/proposal/0xa8b018962096aa1fc22446a395d4298ebb6ca10094f35d072fbb02048e3b5eab'
// const dummyUrl = 'https://snapshot.org/#/uniswap/proposal/0x86ded24b11c4714e0f4f2b6e4ca489f60dc33e6f2f4ababa5575bf5ab973a005'
const dummyUrl = ''

export default function IndexPage() {
  const [proposalId, setProposalId] = useState<string>()
  const [isLoadingProposal, setIsLoadingProposal] = useState<boolean>(false)
  const { proposal, votes } = useSnapshotProposalData(proposalId)

  useEffect(() => {
    ;(async () => {
      const tab = await getCurrentTab()
      const proposalId = parseValidSnapshotProposalUrl(tab?.url || dummyUrl)
      if (!proposalId) return
      setIsLoadingProposal(true)
      setProposalId(proposalId)
    })()
  }, [])

  useEffect(() => {
    if (proposal && votes && isLoadingProposal) setIsLoadingProposal(false)
  }, [proposal, votes])

  return (
    <Box width={400} height={600} p={2} bgcolor="#f7f8f9" sx={{ overflowX: 'hidden', overflowY: 'scroll' }}>
      {isLoadingProposal ? (
        <Typography variant="h6" fontWeight="bold" textAlign="center">
          ...Loading Proposal...
        </Typography>
      ) : !proposal || !votes ? (
        <Typography variant="h6" fontWeight="bold" textAlign="center">
          Navigate to a proposal on Snapshot
        </Typography>
      ) : (
        <Proposal proposal={proposal} votes={votes} />
      )}
    </Box>
  )
}
