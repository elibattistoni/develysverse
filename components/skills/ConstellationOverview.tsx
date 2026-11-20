import { GROUPS, LINKS, POINTS } from "@/lib/data/skills"
import styles from "./SkillsSection.module.css"

const centers = [[50, 43], [150, 35], [250, 43]] as const
const nodes = POINTS.map(([, cluster, x, y, , anchor]) => ({
  x: centers[cluster][0] + x * 22,
  y: centers[cluster][1] + y * 18,
  cluster,
  anchor,
}))

export default function ConstellationOverview() {
  return (
    <div className={styles.overview} aria-hidden="true">
      <svg viewBox="0 0 300 81" fill="none">
        {LINKS.map(([a, b]) => {
          const from = nodes[a], to = nodes[b]
          const bridge = from.cluster !== to.cluster
          return <line key={`${a}-${b}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
            stroke={bridge ? "#99adc7" : GROUPS[from.cluster].color}
            strokeOpacity={bridge ? .32 : .48} strokeDasharray={bridge ? "3 4" : undefined} />
        })}
        {nodes.map(({ x, y, cluster, anchor }, index) => (
          <circle key={POINTS[index][0]} cx={x} cy={y} r={anchor ? 4 : 2.5} fill={GROUPS[cluster].color} />
        ))}
      </svg>
      <div className={styles.overviewLabels}>
        {GROUPS.map(group => <span key={group.name} style={{ color: group.color }}>{group.name}</span>)}
      </div>
    </div>
  )
}
