import { Box, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import Choice from '@/components/Choice'
import ColumnRow from '@/components/ColumnRow'
import ShadowedBox from '@/components/ShadowedBox'
import VotesChart from '@/components/VotesChart'
import { SnapshotProposal, SnapshotProposalVote } from '@/types'
import { parseQuorumReadable, timestampToDateHourString } from '@/utils'
import ChoiceTopVoters from './ChoiceTopVoters'

export type ProposalProps = {
  proposal: SnapshotProposal
  votes: SnapshotProposalVote[]
}

export default function Proposal({ proposal, votes }: ProposalProps) {
  const [votesPerChoice, setVotesPerChoice] = useState<Record<string, number>>(
    {},
  )
  const [totalVotePower, setTotalVotePower] = useState<number>(1) // avoid division by 0 at start (before calc)
  const [choicesOrderedByVotes, setChoicesOrderedByVotes] = useState<string[]>(proposal.choices) // most voted to least voted (initialize with proposal.choices)

  useEffect(() => {
    const votesPerChoice = proposal.choices.reduce(
      (rec, choice) => {
        rec[choice] = 0
        return rec
      },
      {} as Record<string, number>,
    )

    votes.map((vote) => {
      // Some votes are multi-choices, while others are single-choices
      const choiceIdxs = Array.isArray(vote.choice) ? vote.choice : [vote.choice]
      choiceIdxs.forEach((choiceIdx) => {
        const choice = proposal.choices[choiceIdx - 1] // vote index starts at 1
        votesPerChoice[choice] += vote.vp // ignore vp_state
      })
    })

    const totalVotePower = votes.reduce((acc, vote) => acc + vote.vp, 0)

    setVotesPerChoice(votesPerChoice)
    setTotalVotePower(totalVotePower)
    // Need to clone the array to sort, otherwise it'll throw an error `Cannot assign to read only property '0' of object '[object Array]'`
    setChoicesOrderedByVotes([...proposal.choices].sort((a, b) => votesPerChoice[b] - votesPerChoice[a]))
  }, [proposal, votes])

  return (
    <Box>
      <Typography variant="h6" px={2} pb={1} lineHeight={1.2}>
        {proposal.title}
      </Typography>
      <ColumnRow>
        <Box>
          <Typography variant="body2">Start</Typography>
          <Typography variant="body2" color="#aaa">
            {timestampToDateHourString(proposal.start * 1000)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" textAlign="right">
            Ends
          </Typography>
          <Typography variant="body2" color="#aaa">
            {timestampToDateHourString(proposal.end * 1000)}
          </Typography>
        </Box>
      </ColumnRow>
      <ColumnRow sx={{ pt: 1.5 }}>
        <Typography variant="body2">Quorum</Typography>
        <Typography variant="body2" fontWeight={500} color="#DA667B">{`${
          parseQuorumReadable(proposal.quorum, totalVotePower)[0]
        }`}</Typography>
      </ColumnRow>
      <ShadowedBox>
        <Stack direction="column" spacing={2}>
          {choicesOrderedByVotes.map((choice) => (
            <Choice
              key={choice}
              title={choice}
              vp={votesPerChoice[choice] || 0}
              progress={((votesPerChoice[choice] || 0) / totalVotePower) * 100}
            />
          ))}
        </Stack>
      </ShadowedBox>
      <VotesChart proposal={proposal} votes={votes} sx={{ height: 250, mt: 2, mb: 4 }} />
      <ShadowedBox>
        <Typography variant="body1" fontWeight="bold" textAlign="center">Top Voters</Typography>
        <Stack direction="column" spacing={1}>
          {choicesOrderedByVotes.map((choice, idx) => (
            <ChoiceTopVoters
              key={choice}
              choice={choice}
              choiceIndex={idx}
              votes={votes}
              totalVotePower={totalVotePower}
              n={3}
            />
          ))}
        </Stack>
      </ShadowedBox>
    </Box>
  )
}
