import { gql } from '@apollo/client'
import { useMemo, useState } from 'react'

import { getSnapshotProposal, getSnapshotProposalVotes } from '@/utils/snapshot'
import { SnapshotProposal, SnapshotProposalVote } from '@/types'

export default function useSnapshotProposalData(
  proposalId: string | undefined,
) {
  const [proposal, setProposal] = useState<SnapshotProposal>()
  const [votes, setVotes] = useState<SnapshotProposalVote[]>()

  useMemo(async () => {
    if (!proposalId) return
    console.log('proposalId', proposalId)

    const proposal = await getSnapshotProposal(proposalId)
    if (!proposal) return
    setProposal(proposal)

    // Fetch votes if proposal exists
    const votes = await getSnapshotProposalVotes(proposalId)
    setVotes(votes)
  }, [proposalId])

  return { proposal, votes }
}
