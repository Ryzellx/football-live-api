export const IMG_TEAM = (id: number | string) =>
  `https://images.fotmob.com/image_resources/logo/teamlogo/${id}.png`;
export const IMG_LEAGUE = (id: number | string) =>
  `https://images.fotmob.com/image_resources/logo/leaguelogo/${id}.png`;
export const IMG_PLAYER = (id: number | string) =>
  `https://images.fotmob.com/image_resources/logo/playerimages/${id}.png`;
export const IMG_PLAYER_LARGE = (id: number | string) =>
  `https://images.fotmob.com/image_resources/playerimages/${id}.png`;

export function isLive(status: any): boolean {
  if (!status) return false;
  return status.ongoing === true || (status.started === true && status.finished === false && status.cancelled !== true);
}

export function statusText(status: any): string {
  if (!status) return '';
  if (status.cancelled === true) return 'PPD';
  if (isLive(status)) {
    const live = typeof status.liveTime === 'object' ? status.liveTime?.short : status.liveTime;
    return String(live || 'LIVE');
  }
  if (status.finished === true) return String(status.reason?.short || 'FT');
  return String((status.utcTime || '').slice(11, 16));
}

export function withMatchLogos(m: any): any {
  if (!m || typeof m !== 'object') return m;
  return {
    ...m,
    home: m.home ? { ...m.home, logo: m.home.logo || IMG_TEAM(m.home.id) } : m.home,
    away: m.away ? { ...m.away, logo: m.away.logo || IMG_TEAM(m.away.id) } : m.away,
    isLive: isLive(m.status),
    statusText: statusText(m.status),
  };
}

export function withLeagueLogos(data: any): any {
  if (!data?.leagues) return data;
  return {
    ...data,
    leagues: data.leagues.map((lg: any) => ({
      ...lg,
      logo: lg.logo || IMG_LEAGUE(lg.primaryId || lg.id),
      matches: (lg.matches || []).map(withMatchLogos),
    })),
  };
}

export interface SplitFixtures {
  upcoming: any[];
  results: any[];
}

export function splitFixturesResults(fixtures: any[]): SplitFixtures {
  const list = Array.isArray(fixtures) ? fixtures : [];
  const upcoming = list.filter((f: any) => f?.notStarted === true || f?.status?.finished === false);
  const results = list.filter((f: any) => f?.status?.finished === true).reverse();
  return { upcoming, results };
}

export interface TopStat {
  title: string;
  key: string;
  home: string;
  away: string;
}

export function extractTopStats(detail: any): TopStat[] {
  const groups: any[] = detail?.content?.stats?.Periods?.All?.stats || [];
  const top = groups.find((g: any) => /top stats/i.test(String(g?.title || ''))) || groups[0];
  const rows: any[] = top?.stats || [];
  return rows.map((s: any) => ({
    title: String(s?.title || ''),
    key: String(s?.key || ''),
    home: String(Array.isArray(s?.stats) ? s.stats[0] : s?.stats ?? ''),
    away: String(Array.isArray(s?.stats) ? s.stats[1] : ''),
  }));
}

export function matchEvents(detail: any): any[] {
  const raw = detail?.content?.matchFacts?.events;
  if (Array.isArray(raw)) return raw;
  return raw?.events || [];
}

export function goalsAndCards(events: any[]): { goals: any[]; cards: any[] } {
  const goals = events.filter((e: any) => /goal/i.test(String(e?.type || '')));
  const cards = events.filter((e: any) => /card/i.test(String(e?.type || '')));
  return { goals, cards };
}

export interface TimelineItem {
  minute: number;
  minuteStr: string;
  type: string;
  isHome: boolean | null;
  player: string | null;
  playerId: string | number | null;
  detail: string | null;
}

export function buildTimeline(detail: any): TimelineItem[] {
  const events = matchEvents(detail);
  return events
    .map((e: any) => {
      const minute = Number(e?.time ?? e?.timeStr ?? e?.min ?? 0) || 0;
      const added = Number(e?.overloadTime ?? e?.minAdded ?? 0) || 0;
      return {
        minute,
        minuteStr: added > 0 ? `${minute}+${added}'` : `${minute}'`,
        type: String(e?.type || 'Event'),
        isHome: typeof e?.isHome === 'boolean' ? e.isHome : null,
        player: e?.player?.name || e?.playerName || (Array.isArray(e?.swap) ? e.swap.map((s: any) => s?.name).filter(Boolean).join(' ⇄ ') : null) || null,
        playerId: e?.player?.id ?? e?.playerId ?? null,
        detail: e?.goalDescription || e?.cardDescription || e?.suffix || e?.situation || null,
      };
    })
    .sort((a, b) => a.minute - b.minute);
}

export interface StandingRow {
  idx: number;
  id: number | string;
  name: string;
  shortName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  scoresStr: string;
  goalDiff: number;
  pts: number;
  qualColor: string | null;
  logo: string;
}

export function normalizeStandingRow(r: any): StandingRow {
  return {
    idx: Number(r?.idx ?? 0),
    id: r?.id ?? r?.teamId ?? '',
    name: String(r?.name || r?.teamName || ''),
    shortName: String(r?.shortName || ''),
    played: Number(r?.played ?? 0),
    wins: Number(r?.wins ?? 0),
    draws: Number(r?.draws ?? 0),
    losses: Number(r?.losses ?? 0),
    scoresStr: String(r?.scoresStr || ''),
    goalDiff: Number(r?.goalConDiff ?? r?.goalDiff ?? 0),
    pts: Number(r?.pts ?? 0),
    qualColor: r?.qualColor ?? null,
    logo: IMG_TEAM(r?.id ?? r?.teamId ?? ''),
  };
}

export function normalizeTable(tltable: any): {
  all: StandingRow[];
  home: StandingRow[];
  away: StandingRow[];
  form: any[];
  xg: any[];
  legend: any[];
} {
  const first = Array.isArray(tltable) ? tltable[0] : tltable;
  const table = first?.data?.table || first?.table || {};
  const map = (rows: any[]) => (Array.isArray(rows) ? rows.map(normalizeStandingRow) : []);
  return {
    all: map(table.all),
    home: map(table.home),
    away: map(table.away),
    form: Array.isArray(table.form) ? table.form : [],
    xg: Array.isArray(table.xg)
      ? table.xg.map((r: any) => ({
          ...normalizeStandingRow(r),
          xg: r?.xg ?? null,
          xgConceded: r?.xgConceded ?? null,
          xPoints: r?.xPoints ?? null,
          xPosition: r?.xPosition ?? null,
          xPointsDiff: r?.xPointsDiff ?? null,
        }))
      : [],
    legend: first?.data?.legend || [],
  };
}

export function statBlockByHeader(data: any, pattern: RegExp): any {
  const players = data?.stats?.players || [];
  return players.find((p: any) => pattern.test(String(p?.header || ''))) || null;
}

export function enrichStatBlock(block: any): any {
  if (!block || typeof block !== 'object') return block;
  const mapEntry = (p: any) => ({
    ...p,
    logo: p?.teamId ? IMG_TEAM(p.teamId) : undefined,
    faceImageUrl: p?.id ? IMG_PLAYER(p.id) : undefined,
  });
  return {
    ...block,
    participant: block.participant ? mapEntry(block.participant) : block.participant,
    topThree: Array.isArray(block.topThree) ? block.topThree.map(mapEntry) : block.topThree,
  };
}

export function playerPosition(p: any): string | null {
  if (typeof p?.positionDescription === 'string') return p.positionDescription;
  const primary = p?.positionDescription?.primaryPosition?.label;
  if (primary) return String(primary);
  const first = p?.positionDescription?.positions?.[0]?.strPos?.label;
  if (first) return String(first);
  if (typeof p?.position === 'string') return p.position;
  return null;
}

export function playerAge(p: any): number | null {
  const utc = p?.birthDate?.utcTime;
  if (!utc) return null;
  const born = new Date(utc).getTime();
  if (Number.isNaN(born)) return null;
  return Math.floor((Date.now() - born) / (365.25 * 24 * 3600 * 1000));
}

export interface SquadGroups {
  coach: any | null;
  keepers: any[];
  defenders: any[];
  midfielders: any[];
  attackers: any[];
}

export function normalizeSquad(squad: any): SquadGroups {
  const groups: any[] = squad?.squad || [];
  const byTitle = (t: RegExp) => groups.find((g: any) => t.test(String(g?.title || '')))?.members || [];
  const withFace = (members: any[]) =>
    members.map((m: any) => ({ ...m, faceImageUrl: m?.id ? IMG_PLAYER(m.id) : undefined }));
  return {
    coach: byTitle(/coach/i)[0] || null,
    keepers: withFace(byTitle(/keeper|goal/i)),
    defenders: withFace(byTitle(/defen/i)),
    midfielders: withFace(byTitle(/midfield/i)),
    attackers: withFace(byTitle(/attack|forward|striker/i)),
  };
}

export type TransferFilter = 'all' | 'latest' | 'official' | 'loans' | 'free';

export function filterTransfers(payload: any, filter: TransferFilter, limit = 50): any {
  const list: any[] = Array.isArray(payload?.transfers) ? payload.transfers : [];
  let out = list;
  if (filter === 'loans') out = list.filter((t: any) => t?.onLoan === true);
  else if (filter === 'free')
    out = list.filter((t: any) => /free/i.test(String(t?.fee?.feeText || t?.transferType?.text || '')));
  else if (filter === 'official')
    out = list.filter((t: any) => t?.contractExtension !== true);
  out = [...out].sort(
    (a, b) => new Date(b?.transferDate || 0).getTime() - new Date(a?.transferDate || 0).getTime(),
  );
  const mapped = out.slice(0, limit).map((t: any) => ({
    ...t,
    fromClubLogo: t?.fromClubId ? IMG_TEAM(t.fromClubId) : undefined,
    toClubLogo: t?.toClubId ? IMG_TEAM(t.toClubId) : undefined,
    playerFace: t?.playerId ? IMG_PLAYER(t.playerId) : undefined,
  }));
  return { transfers: mapped, total: out.length, hits: payload?.hits ?? null, maxFee: payload?.maxFee ?? null };
}

export function suggestInfo(s: any): string | null {
  return s?.info || s?.teamName || s?.leagueName || s?.countryName || s?.ccode || null;
}
