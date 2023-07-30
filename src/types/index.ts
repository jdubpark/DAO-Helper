export type SnapshotProposal = {
  id: string
  title: string
  type: string
  symbol: string
  body: string
  choices: string[]
  created: number // timestamp
  start: number // timestamp
  end: number // timestamp
  snapshot: string
  state: string
  author: string
  space: {
    id: string
    name: string
  }
  votes: number
  quorum: number
  scores: number[]
  scores_state: string
  scores_total: number
  scores_updated: number
}

export type SnapshotProposalDetailed = SnapshotProposal & {
  ipfs: string
  network: string // chain id
  plugins: any
  privacy: string
  discussion: string
  validation: {
    name: string
    params: any
  }
  strategies: {
    name: string
    network: string
    params: any
  }[]
  scores_by_strategy: any[]
  flagged: boolean
}

export type SnapshotProposalVote = {
  id: string
  voter: string
  created: number // timestamp
  choice: number | number[] // index of choices (indexed 1-based. The first choice has index 1.)
  vp: number // voting power
  vp_state: string
}

export type SnapshotProposalVoteDetailed = SnapshotProposalVote & {
  reason: string
  vp_by_strategy: number[]
}
