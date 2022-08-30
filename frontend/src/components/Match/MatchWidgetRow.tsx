import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { MatchMin } from '../../generated/graphql'
import { MatchWidget } from './MatchWidget'

const MatchWidgetRowWrapper = styled.div`
	margin-top: 50px;
`

const MatchWidgetRowHeader = styled.header`
	display: flex;
	flex-direction: row;
	align-items: baseline;
	margin-bottom: 10px;
`

const MatchWidgetRowTitle = styled.h3`
	font-family: 'Roboto Condensed', sans-serif;
	font-size: 15px;
	font-weight: 700;
	text-transform: uppercase;
	margin-right: 10px;
`

const MatchWidgetRowLink = styled.a`
	font-family: 'Roboto Condensed', sans-serif;
	font-size: 12px;
	font-weight: 400;
	color: #6f6f6f;
	text-decoration: none;
`

const MatchWidgetRowItems = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;

	& > :not(:last-child) {
		margin-right: 20px;
	}
`

interface MatchWidgetRowProps {
	title: string
	leagueId: string
	matches: MatchMin[]
}

export const MatchWidgetRow: React.FC<MatchWidgetRowProps> = ({
	title,
	leagueId,
	matches,
}) => {
	if (matches.length === 0) return null

	return (
		<MatchWidgetRowWrapper>
			<MatchWidgetRowHeader>
				<MatchWidgetRowTitle>{title}</MatchWidgetRowTitle>
				<Link href={`/league/${leagueId}/games`} passHref>
					<MatchWidgetRowLink>Összes</MatchWidgetRowLink>
				</Link>
			</MatchWidgetRowHeader>
			<MatchWidgetRowItems>
				{matches.map((x) => (
					<MatchWidget key={x.id} match={x} />
				))}
			</MatchWidgetRowItems>
		</MatchWidgetRowWrapper>
	)
}
