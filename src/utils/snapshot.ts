import { gql } from '@apollo/client'

import {
  SnapshotProposal,
  SnapshotProposalDetailed,
  SnapshotProposalVote,
  SnapshotProposalVoteDetailed,
} from '@/types'
import apolloClient from '@/utils/apollo'

export async function getSnapshotProposal(
  proposalId: string,
): Promise<SnapshotProposal> {
  const { data } = await apolloClient.query<{ proposal: SnapshotProposal }>({
    query: gql`
      query Proposal($id: String!) {
        proposal(id: $id) {
          id
          title
          type
          symbol
          body
          choices
          created
          start
          end
          snapshot
          state
          author
          space {
            id
            name
          }
          votes
          quorum
          scores
          scores_state
          scores_total
          scores_updated
        }
      }
    `,
    variables: {
      id: proposalId,
    },
  })

  return data.proposal
}

export async function getSnapshotProposalDetailed(
  proposalId: string,
): Promise<SnapshotProposalDetailed> {
  const { data } = await apolloClient.query<{
    proposal: SnapshotProposalDetailed
  }>({
    query: gql`
      query Proposal($id: String!) {
        proposal(id: $id) {
          id
          title
          type
          symbol
          body
          choices
          created
          start
          end
          snapshot
          state
          author
          space {
            id
            name
          }
          votes
          quorum
          scores
          scores_state
          scores_total
          scores_updated

          ipfs
          network
          plugins
          privacy
          discussion
          validation {
            name
            params
          }
          strategies {
            name
            network
            params
          }
          scores_by_strategy
          flagged
        }
      }
    `,
    variables: {
      id: proposalId,
    },
  })

  return data.proposal
}

export async function getSnapshotProposalVotes(
  proposalId: string,
): Promise<SnapshotProposalVote[]> {
  const { data } = await apolloClient.query<{
    votes: SnapshotProposalVote[]
  }>({
    query: gql`
      query Votes($id: String!) {
        votes(where: { proposal: $id }, orderBy: "vp", orderDirection: desc) {
          id
          voter
          created
          choice
          vp
          vp_state
        }
      }
    `,
    variables: {
      id: proposalId,
    },
  })
  return data.votes
}

export async function getSnapshotProposalVotesDetailed(
  proposalId: string,
): Promise<SnapshotProposalVoteDetailed[]> {
  const { data } = await apolloClient.query<{
    votes: SnapshotProposalVoteDetailed[]
  }>({
    query: gql`
      query Votes($id: String!) {
        votes(where: { proposal: $id }, orderBy: "vp", orderDirection: desc) {
          id
          voter
          created
          choice
          vp
          vp_state

          reason
          vp_by_strategy
        }
      }
    `,
    variables: {
      id: proposalId,
    },
  })
  return data.votes
}
