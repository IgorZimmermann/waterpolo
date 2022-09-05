import moment from 'moment'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { PageWrapper } from '../../components/PageWrapper'
import { useMatchByIdQuery } from '../../generated/graphql'

/* https://www.tutorialspoint.com/group-array-by-equal-values-javascript */
function groupSimilar(arr: Array<any>): Array<any> {
	return arr.reduce(
		(acc, val) => {
			const { data, map } = acc
			const ind = map.get(val)
			if (map.has(val)) {
				data[ind][1]++
			} else {
				map.set(val, data.push([val, 1]) - 1)
			}
			return { data, map }
		},
		{
			data: [],
			map: new Map(),
		}
	).data
}

const GameSpacer = styled.hr`
	margin: 40px 0 20px 0;
	width: 100%;
	border: 1px solid #000000;
`

const GameSectionTitle = styled.h3`
	font-family: 'Roboto Condensed', sans-serif;
	font-size: 15px;
	font-weight: 700;
	text-transform: uppercase;
	margin-bottom: 20px;
	width: 100%;
	text-align: center;
`

const GameHeader = styled.header`
	padding-top: 80px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;

	@media only screen and (max-width: 768px) {
		flex-direction: column;
		align-items: center;
		padding-top: 20px;
	}
`

const GameHeaderTeam = styled.h2`
	font-family: 'Roboto Condensed', sans-serif;
	font-weight: 700;
	font-size: 40px;
	text-transform: uppercase;
	color: #000000;
	width: 35%;

	&:not(:first-child) {
		text-align: right;
	}

	@media only screen and (max-width: 770px) {
		text-align: center !important;
		width: 100%;
		font-size: 30px;
	}
`

const GameHeaderScoreWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;

	@media only screen and (max-width: 770px) {
		margin: 20px 0;
	}
`

const GameHeaderScore = styled.h3`
	font-family: 'Oswald', sans-serif;
	font-weight: 700;
	font-size: 50px;
	text-transform: uppercase;
	color: #000000;

	@media only screen and (max-width: 770px) {
		font-size: 35px;
	}
`

const GameHeaderScoreQuarter = styled.span`
	font-family: 'Oswald', sans-serif;
	font-weight: 400;
	font-size: 20px;
	text-transform: uppercase;
	color: #6f6f6f;

	@media only screen and (max-width: 770px) {
		font-size: 15px;
	}
`

const GameColumnsWrapper = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-around;

	@media only screen and (max-width: 770px) {
		flex-direction: column;
		flex-flow: column-reverse;
	}
`

const GameColumn = styled.div`
	display: flex;
	flex-direction: column;

	&:nth-child(1) {
		margin-right: 30px;
		width: 75%;
	}

	&:nth-child(2) {
		width: 25%;
	}

	@media only screen and (max-width: 770px) {
		width: 100% !important;
		margin: 0 !important;
	}
`

const GameScorersWrapper = styled.div`
	display: flex;
	flex-direction: column;
`

const GameScorersRow = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-around;
`

const GameScorers = styled.p`
	font-family: 'Roboto Condensed', sans-serif;
	font-weight: 400;
	font-size: 400;
	color: #000000;
	width: 35%;

	text-align: right;
	&:not(:first-child) {
		text-align: left;
	}
`

const GameTimelineWrapper = styled.div``

const GameTimelineList = styled.ul`
	list-style-type: none;
	width: 100%;
	padding: 0;
`

const GameTimelineListItem = styled.li`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;

	&:not(:last-child) {
		margin-bottom: 20px;
	}
`

const GameTimelineListItemText = styled.span<{ bold: boolean }>`
	font-family: 'Roboto Condensed', sans-serif;
	font-size: 14px;
	font-weight: ${(props) => (props.bold ? 700 : 400)};
	text-transform: ${(props) => (props.bold ? `uppercase` : `none`)};
	width: 50%;

	text-align: right;
	padding-right: 20px;
	&:not(:first-child) {
		text-align: left;
		padding-left: 20px;
	}
`

const GameTimelineListItemBold = styled.span`
	font-family: 'Roboto Condensed', sans-serif;
	font-size: 13px;
	font-weight: 700;
	width: 100%;
	text-align: center;
	margin: 20px 0;
	text-transform: uppercase;
`

const GameTimelineListItemTime = styled.span`
	font-family: 'Oswald', sans-serif;
	font-weight: 400;
`

const GameLineupWrapper = styled.div``

const GameLineupTableWrapper = styled.div`
	width: 100%;
	font-family: 'Roboto Condensed', sans-serif;
	border: 2px solid #000000;

	&:not(:last-child) {
		margin-bottom: 10px;
	}
`

const GameLineupTableTitle = styled.h4`
	text-transform: uppercase;
	text-align: left;
	width: 100%;
	border-bottom: 2px solid #000000;
	padding-left: 20px;
`

const GameLineupTable = styled.table`
	width: 100%;
`

const GameLineupTableRow = styled.tr<{ highlight?: boolean }>`
	background-color: ${(props) => (props.highlight ? '#000000' : 'none')};

	& > td {
		color: ${(props) => (props.highlight ? '#ffffff' : '#000000')};
	}
`

const GameLineupTableDataNumber = styled.td`
	width: 5%;
	text-align: center;
`

const GameInfoWrapper = styled.div`
	display: flex;
	flex-direction: column;

	& :not(:last-child) {
		margin-bottom: 0px;
	}
`

const GameInfoData = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`

const GameInfoDataTitle = styled.h6`
	font-family: 'Roboto Condensed', sans-serif;
	font-size: 13px;
	text-transform: uppercase;
	font-weight: 700;
`

const GameInfoDataValue = styled.p`
	font-family: 'Roboto Condensed', sans-serif;
	font-size: 13px;
`

const Game: NextPage = () => {
	const router = useRouter()
	const { id } = router.query
	const { loading, data } = useMatchByIdQuery({
		variables: {
			id: id as string,
		},
		pollInterval: 2000,
	})

	const goals_home =
		loading || !data
			? []
			: data.matchById.events
					.filter(
						(x) =>
							x.eventType.toLowerCase().includes('gól') &&
							!x.eventType.toLowerCase().includes('gólpassz') &&
							x.team === data.matchById.team_home
					)
					.map((y) => y.player.name)

	const goals_away =
		loading || !data
			? []
			: data.matchById.events
					.filter(
						(x) =>
							x.eventType.toLowerCase().includes('gól') &&
							!x.eventType.toLowerCase().includes('gólpassz') &&
							x.team === data.matchById.team_away
					)
					.map((y) => y.player.name)

	const crucialEvents = ['gól', 'labdaelhozás', 'büntetődobás', 'vége']
	const eventsFiltered =
		loading || !data
			? []
			: data.matchById.events.filter((x) =>
					crucialEvents.some(
						(y) =>
							x.eventType.toLowerCase().includes(y) &&
							!x.eventType.toLowerCase().includes('gólpassz')
					)
			  )

	return (
		<div>
			{loading || !data ? (
				<span>loading...</span>
			) : (
				<PageWrapper
					title={`${data.matchById.team_home} v ${data.matchById.team_away} | Waterpolo`}
				>
					<GameHeader>
						<GameHeaderTeam>{data.matchById.team_home}</GameHeaderTeam>
						<GameHeaderScoreWrapper>
							<GameHeaderScore>
								{data.matchById.score_home} - {data.matchById.score_away}
							</GameHeaderScore>
							<GameHeaderScoreQuarter>
								{data.matchById.quarters
									.map((x) => `${x.score_home}-${x.score_away}`)
									.join(', ')}
							</GameHeaderScoreQuarter>
						</GameHeaderScoreWrapper>
						<GameHeaderTeam>{data.matchById.team_away}</GameHeaderTeam>
					</GameHeader>
					<GameSpacer />
					<GameColumnsWrapper>
						<GameColumn>
							<GameScorersWrapper>
								<GameSectionTitle>Góllövők</GameSectionTitle>
								<GameScorersRow>
									<GameScorers>
										{groupSimilar(goals_home)
											.sort((a, b) => b[1] - a[1])
											.map((x) => `${x[0]} ${x[1]}x`)
											.join(', ')}
									</GameScorers>
									<GameScorers>
										{groupSimilar(goals_away)
											.sort((a, b) => b[1] - a[1])
											.map((x) => `${x[0]} ${x[1]}x`)
											.join(', ')}
									</GameScorers>
								</GameScorersRow>
							</GameScorersWrapper>
							<GameSpacer />
							<GameTimelineWrapper>
								<GameSectionTitle>Idővonal</GameSectionTitle>
								<GameTimelineList>
									{eventsFiltered.map((x, i) => {
										if (x.eventType.toLowerCase().includes('vége')) {
											return (
												<GameTimelineListItem>
													<GameTimelineListItemBold>
														{x.time.quarter} negyed vége
													</GameTimelineListItemBold>
												</GameTimelineListItem>
											)
										} else {
											return (
												<GameTimelineListItem key={i}>
													<GameTimelineListItemText
														bold={x.team === data.matchById.team_home}
													>
														{x.team === data.matchById.team_home
															? x.player.name
															: x.eventType}
													</GameTimelineListItemText>
													<GameTimelineListItemTime>
														{moment.utc(x.time.seconds * 1000).format('mm:ss')}
													</GameTimelineListItemTime>
													<GameTimelineListItemText
														bold={x.team === data.matchById.team_away}
													>
														{x.team === data.matchById.team_away
															? x.player.name
															: x.eventType}
													</GameTimelineListItemText>
												</GameTimelineListItem>
											)
										}
									})}
								</GameTimelineList>
							</GameTimelineWrapper>
						</GameColumn>
						<GameColumn>
							<GameLineupWrapper>
								<GameSectionTitle>Játékosok</GameSectionTitle>
								<GameLineupTableWrapper>
									<GameLineupTableTitle>
										{data.matchById.team_home}
									</GameLineupTableTitle>
									<GameLineupTable>
										<tbody>
											{data.matchById.lineup_home.map((x, i) => (
												<GameLineupTableRow
													key={i}
													highlight={x.number === 1 || x.number === 14}
												>
													<GameLineupTableDataNumber>
														{x.number}
													</GameLineupTableDataNumber>
													<td>{x.name}</td>
												</GameLineupTableRow>
											))}
										</tbody>
									</GameLineupTable>
								</GameLineupTableWrapper>
								<GameLineupTableWrapper>
									<GameLineupTableTitle>
										{data.matchById.team_away}
									</GameLineupTableTitle>
									<GameLineupTable>
										<tbody>
											{data.matchById.lineup_away.map((x, i) => (
												<GameLineupTableRow
													key={i}
													highlight={x.number === 1 || x.number === 14}
												>
													<GameLineupTableDataNumber>
														{x.number}
													</GameLineupTableDataNumber>
													<td>{x.name}</td>
												</GameLineupTableRow>
											))}
										</tbody>
									</GameLineupTable>
								</GameLineupTableWrapper>
							</GameLineupWrapper>
							<GameSpacer />
							<GameInfoWrapper>
								<GameSectionTitle>adatok</GameSectionTitle>
								<GameInfoData>
									<GameInfoDataTitle>helyszín</GameInfoDataTitle>
									<GameInfoDataValue>
										{data.matchById.location ?? '?'}
									</GameInfoDataValue>
								</GameInfoData>
								<GameInfoData>
									<GameInfoDataTitle>dátum</GameInfoDataTitle>
									<GameInfoDataValue>
										{moment(data.matchById.date).isValid()
											? moment(data.matchById.date).format('llll')
											: '?'}
									</GameInfoDataValue>
								</GameInfoData>
								<GameInfoData>
									<GameInfoDataTitle>bajonkság</GameInfoDataTitle>
									<GameInfoDataValue>{data.matchById.league}</GameInfoDataValue>
								</GameInfoData>
							</GameInfoWrapper>
							<GameSpacer />
						</GameColumn>
					</GameColumnsWrapper>
				</PageWrapper>
			)}
		</div>
	)
}

export default Game
