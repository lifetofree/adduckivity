import Link from 'next/link'
import Image from 'next/image'
import { ET } from '@/lib/theme'

const PURPLE = '#a78bfa'
const PURPLE_BG = 'rgba(167,139,250,0.1)'
const PURPLE_BORDER = 'rgba(167,139,250,0.25)'

const nodeTypes = [
  {
    type: 'Action',
    icon: '☑',
    color: '#E8F4F8',
    colorBg: 'rgba(232,244,248,0.08)',
    colorBorder: 'rgba(232,244,248,0.15)',
    description:
      'A manual checkpoint — a physical or cognitive task you complete before moving on. Examples: "Morning stretch 5 min", "Write 3 priorities", "Review yesterday\'s output." You tap "Next Step →" when done.',
    example: 'Morning Ritual, Daily Review, Cold Shower Protocol',
  },
  {
    type: 'Timer',
    icon: '⏱',
    color: '#00E5FF',
    colorBg: 'rgba(0,229,255,0.08)',
    colorBorder: 'rgba(0,229,255,0.25)',
    description:
      'A focused work block with a countdown. You set the duration (default: 25 min). In Flow Mode, a large monospace timer appears with "Initialize Countdown." When it hits zero, the next node auto-unlocks.',
    example: 'Deep Work Session 25 min, Focus Block 90 min, Reading 20 min',
  },
  {
    type: 'Tool',
    icon: '⚡',
    color: '#00E5FF',
    colorBg: 'rgba(0,229,255,0.08)',
    colorBorder: 'rgba(0,229,255,0.25)',
    description:
      'A link to another Duck OS tool — currently The Atomizer. In Flow Mode, a "Launch Atomizer" button appears. When you complete the atomizer session, it returns you automatically to the Protocol Builder at the correct node.',
    example: 'Break Down Project, Atomize the Scary Task',
  },
  {
    type: 'Ignition',
    icon: '🔥',
    color: '#f43f5e',
    colorBg: 'rgba(244,63,94,0.08)',
    colorBorder: 'rgba(244,63,94,0.25)',
    description:
      'Triggers the 600-second Ignition sequence inside the protocol flow. Useful as the very first node when you need to break inertia before your first deep work block. After ignition completes, the next connected node activates automatically.',
    example: 'Pre-Work Ignition, Day Starter Protocol',
  },
]

const concepts = [
  {
    num: '01',
    title: 'Constellation Graph',
    body: 'Your protocol is a 3D graph of nodes floating in space. Nodes are checkpoints; edges (connections) are the momentum path between them. The visual layout is not functional — what matters is the connection order.',
  },
  {
    num: '02',
    title: 'Build Mode vs Flow Mode',
    body: 'Build Mode is the architect view: add nodes, edit labels, create connections. Flow Mode is execution: one active node at a time, no sidebar, full focus. Switch with the mode toggles in the top bar.',
  },
  {
    num: '03',
    title: 'Momentum Path',
    body: 'Each node can connect to one or more next nodes. Single connection: auto-advance on "Next Step →." Multiple connections: you choose which branch to follow. No connection: the node is a dead end — the protocol ends there.',
  },
]

// ── SVG Mockups ────────────────────────────────────────────────────────────

function LandingCardMockup() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      <rect width="480" height="300" fill="#0A0F1E" rx="12"/>
      {/* Nav */}
      <rect width="480" height="44" fill="#0F1829"/>
      <circle cx="26" cy="22" r="12" fill="#1E3A5F"/>
      <rect x="46" y="16" width="70" height="12" rx="3" fill="#1E3A5F"/>
      {/* Section label */}
      <text x="240" y="72" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#6B9BB8" letterSpacing="3">DUCK OS TOOLS</text>
      <text x="240" y="90" textAnchor="middle" fontFamily="monospace" fontSize="16" fill="#E8F4F8" fontWeight="900">Your Operating System</text>
      {/* Protocol Builder card — highlighted */}
      <rect x="60" y="108" width="360" height="152" rx="14" fill="#0F1829" stroke={PURPLE} strokeWidth="2"/>
      <rect x="60" y="108" width="360" height="152" rx="14" fill="rgba(167,139,250,0.04)"/>
      {/* Card image area */}
      <rect x="72" y="120" width="336" height="80" rx="8" fill="#1A2840"/>
      {/* Constellation nodes mockup in image */}
      <circle cx="190" cy="160" r="5" fill={PURPLE} opacity="0.8"/>
      <circle cx="240" cy="148" r="5" fill={PURPLE} opacity="0.6"/>
      <circle cx="290" cy="165" r="5" fill={PURPLE} opacity="0.8"/>
      <circle cx="260" cy="178" r="4" fill="#00E5FF" opacity="0.5"/>
      <line x1="190" y1="160" x2="240" y2="148" stroke={PURPLE} strokeWidth="1" opacity="0.4"/>
      <line x1="240" y1="148" x2="290" y2="165" stroke={PURPLE} strokeWidth="1" opacity="0.4"/>
      <line x1="290" y1="165" x2="260" y2="178" stroke="#00E5FF" strokeWidth="1" opacity="0.3"/>
      {/* Badge */}
      <rect x="76" y="124" width="90" height="16" rx="6" fill={PURPLE_BG}/>
      <text x="121" y="136" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={PURPLE} fontWeight="700">System Architect</text>
      {/* Card content */}
      <text x="76" y="220" fontFamily="monospace" fontSize="11" fill="#E8F4F8" fontWeight="700">Protocol Builder</text>
      <rect x="76" y="228" width="200" height="6" rx="2" fill="#1E3A5F" opacity="0.6"/>
      <rect x="76" y="240" width="150" height="6" rx="2" fill="#1E3A5F" opacity="0.4"/>
      <circle cx="372" cy="232" r="14" fill={PURPLE_BG} stroke={PURPLE} strokeWidth="1.5"/>
      <text x="372" y="237" textAnchor="middle" fontSize="12" fill={PURPLE}>→</text>
    </svg>
  )
}

function BuildModeMockup() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      <rect width="480" height="300" fill="#0a0f1e" rx="12"/>
      {/* Nav */}
      <rect width="480" height="44" fill="#0F1829"/>
      <text x="240" y="27" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#6B9BB8" letterSpacing="3">ARCHITECT · BUILD MODE</text>
      {/* Constellation visualization — 3D nodes */}
      {/* Grid lines hint */}
      <line x1="100" y1="172" x2="340" y2="172" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
      <line x1="220" y1="80" x2="220" y2="260" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
      {/* Edges */}
      <line x1="130" y1="150" x2="210" y2="120" stroke={PURPLE} strokeWidth="1.5" opacity="0.4"/>
      <line x1="210" y1="120" x2="290" y2="160" stroke={PURPLE} strokeWidth="1.5" opacity="0.4"/>
      <line x1="290" y1="160" x2="250" y2="220" stroke="rgba(0,229,255,0.3)" strokeWidth="1" opacity="0.5"/>
      {/* Nodes */}
      <circle cx="130" cy="150" r="12" fill={PURPLE_BG} stroke={PURPLE} strokeWidth="1.5"/>
      <text x="130" y="154" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={PURPLE}>ACT</text>
      <circle cx="210" cy="120" r="14" fill="rgba(0,229,255,0.12)" stroke="#00E5FF" strokeWidth="2"/>
      <text x="210" y="124" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#00E5FF">TMR</text>
      <circle cx="290" cy="160" r="12" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1.5"/>
      <text x="290" y="164" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#00E5FF">TOOL</text>
      <circle cx="250" cy="220" r="10" fill="rgba(244,63,94,0.1)" stroke="#f43f5e" strokeWidth="1"/>
      <text x="250" y="224" textAnchor="middle" fontFamily="monospace" fontSize="5" fill="#f43f5e">IGN</text>
      {/* Sidebar */}
      <rect x="360" y="44" width="120" height="256" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
      <text x="420" y="66" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#6B9BB8" letterSpacing="2">NODE ARCHITECT</text>
      {/* Ignite button in sidebar */}
      <rect x="370" y="78" width="100" height="26" rx="4" fill="rgba(244,63,94,0.2)" stroke="rgba(244,63,94,0.4)" strokeWidth="1"/>
      <text x="420" y="95" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#f43f5e" fontWeight="700">🔥 IGNITE</text>
      {/* Node list */}
      <text x="374" y="122" fontFamily="monospace" fontSize="6" fill="#6B9BB8" letterSpacing="2">SYSTEM NODES</text>
      <rect x="370" y="130" width="100" height="22" rx="3" fill="rgba(167,139,250,0.1)" stroke={PURPLE} strokeWidth="0.5"/>
      <text x="380" y="145" fontFamily="monospace" fontSize="7" fill="#E8F4F8">Morning Ritual</text>
      <rect x="370" y="157" width="100" height="22" rx="3" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
      <text x="380" y="172" fontFamily="monospace" fontSize="7" fill="#6B9BB8">Deep Work</text>
      <rect x="370" y="184" width="100" height="22" rx="3" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
      <text x="380" y="199" fontFamily="monospace" fontSize="7" fill="#6B9BB8">Atomizer Tool</text>
    </svg>
  )
}

function AddNodesMockup() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      <rect width="480" height="300" fill="#0a0f1e" rx="12"/>
      {/* Nav */}
      <rect width="480" height="44" fill="#0F1829"/>
      <text x="240" y="27" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#6B9BB8" letterSpacing="3">ARCHITECT · BUILD MODE</text>
      {/* Sidebar takes focus */}
      <rect width="480" height="256" y="44" fill="rgba(0,0,0,0.3)"/>
      <rect x="160" y="44" width="320" height="256" fill="rgba(0,0,0,0.65)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
      {/* Section: Add Nodes */}
      <text x="176" y="70" fontFamily="monospace" fontSize="7" fill="#6B9BB8" letterSpacing="2">SYSTEM NODES</text>
      {/* Add buttons */}
      <rect x="340" y="58" width="26" height="26" rx="5" fill="rgba(0,229,255,0.1)" stroke="rgba(0,229,255,0.3)" strokeWidth="1"/>
      <text x="353" y="75" textAnchor="middle" fontFamily="monospace" fontSize="13" fill="#00E5FF">+</text>
      <rect x="370" y="58" width="26" height="26" rx="5" fill="rgba(0,229,255,0.1)" stroke="rgba(0,229,255,0.3)" strokeWidth="1"/>
      <text x="383" y="75" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#00E5FF">⏱</text>
      <rect x="400" y="58" width="26" height="26" rx="5" fill="rgba(0,229,255,0.1)" stroke="rgba(0,229,255,0.3)" strokeWidth="1"/>
      <text x="413" y="75" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#00E5FF">⬡</text>
      {/* Node list items */}
      {[
        { y: 94, label: 'Morning Ritual', tag: 'action', active: true },
        { y: 122, label: 'Deep Work 25min', tag: 'timer', active: false },
        { y: 150, label: 'Atomize Task', tag: 'tool', active: false },
        { y: 178, label: 'Recovery Walk', tag: 'action', active: false },
      ].map((item) => (
        <g key={item.y}>
          <rect x="170" y={item.y} width="290" height="24" rx="4"
            fill={item.active ? 'rgba(167,139,250,0.1)' : 'rgba(255,255,255,0.03)'}
            stroke={item.active ? PURPLE : 'rgba(255,255,255,0.05)'} strokeWidth={item.active ? '1' : '0.5'}/>
          <text x="182" y={item.y + 16} fontFamily="monospace" fontSize="8"
            fill={item.active ? '#E8F4F8' : '#6B9BB8'}>{item.label}</text>
          <rect x="410" y={item.y + 5} width="38" height="14" rx="3" fill="rgba(0,0,0,0.4)"/>
          <text x="429" y={item.y + 16} textAnchor="middle" fontFamily="monospace" fontSize="6"
            fill="rgba(255,255,255,0.2)">{item.tag}</text>
        </g>
      ))}
      {/* Edit section when active */}
      <line x1="170" y1="212" x2="450" y2="212" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
      <text x="176" y="230" fontFamily="monospace" fontSize="7" fill="#00E5FF" letterSpacing="2">EDIT PROPERTIES</text>
      <text x="176" y="246" fontFamily="monospace" fontSize="7" fill="#6B9BB8">LABEL</text>
      <rect x="176" y="252" width="260" height="18" rx="3" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
      <text x="184" y="264" fontFamily="monospace" fontSize="7" fill="#E8F4F8">Morning Ritual</text>
    </svg>
  )
}

function ConnectMockup() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      <rect width="480" height="300" fill="#0a0f1e" rx="12"/>
      {/* Nav */}
      <rect width="480" height="44" fill="#0F1829"/>
      <text x="240" y="27" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#6B9BB8" letterSpacing="3">ARCHITECT · MOMENTUM PATH</text>
      <rect x="160" y="44" width="320" height="256" fill="rgba(0,0,0,0.65)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
      {/* Momentum path section */}
      <text x="176" y="74" fontFamily="monospace" fontSize="7" fill="#6B9BB8" letterSpacing="2">⛓ MOMENTUM PATH</text>
      {/* Existing connections */}
      <text x="176" y="96" fontFamily="monospace" fontSize="7" fill="#6B9BB8">Existing outgoing connections:</text>
      <rect x="176" y="102" width="264" height="22" rx="3" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
      <text x="188" y="117" fontFamily="monospace" fontSize="8" fill="rgba(255,255,255,0.6)">→ Deep Work 25min</text>
      <text x="424" y="117" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="rgba(255,68,68,0.4)">✕</text>
      <rect x="176" y="128" width="264" height="22" rx="3" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
      <text x="188" y="143" fontFamily="monospace" fontSize="8" fill="rgba(255,255,255,0.6)">→ Recovery Walk</text>
      {/* Add connection */}
      <text x="176" y="168" fontFamily="monospace" fontSize="7" fill="#6B9BB8">Add connection:</text>
      <rect x="176" y="174" width="196" height="22" rx="3" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
      <text x="188" y="189" fontFamily="monospace" fontSize="7" fill="#6B9BB8">Connect to...</text>
      <rect x="378" y="174" width="62" height="22" rx="3" fill="rgba(0,229,255,0.15)" stroke="rgba(0,229,255,0.3)" strokeWidth="1"/>
      <text x="409" y="189" textAnchor="middle" fontFamily="monospace" fontSize="14" fill="#00E5FF">+</text>
      {/* Visual diagram */}
      <text x="176" y="220" fontFamily="monospace" fontSize="7" fill="#6B9BB8">Path preview:</text>
      <circle cx="210" cy="254" r="10" fill={PURPLE_BG} stroke={PURPLE} strokeWidth="1.5"/>
      <text x="210" y="258" textAnchor="middle" fontFamily="monospace" fontSize="6" fill={PURPLE}>A</text>
      <line x1="220" y1="254" x2="290" y2="244" stroke={PURPLE} strokeWidth="1" opacity="0.5" strokeDasharray="4,2"/>
      <line x1="220" y1="254" x2="290" y2="264" stroke={PURPLE} strokeWidth="1" opacity="0.5" strokeDasharray="4,2"/>
      <circle cx="300" cy="244" r="8" fill="rgba(0,229,255,0.1)" stroke="#00E5FF" strokeWidth="1"/>
      <text x="300" y="248" textAnchor="middle" fontFamily="monospace" fontSize="5" fill="#00E5FF">B</text>
      <circle cx="300" cy="264" r="8" fill="rgba(167,139,250,0.1)" stroke={PURPLE} strokeWidth="1"/>
      <text x="300" y="268" textAnchor="middle" fontFamily="monospace" fontSize="5" fill={PURPLE}>C</text>
      <text x="320" y="248" fontFamily="monospace" fontSize="6" fill="#6B9BB8">Deep Work</text>
      <text x="320" y="268" fontFamily="monospace" fontSize="6" fill="#6B9BB8">Recovery Walk</text>
    </svg>
  )
}

function FlowModeMockup() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      <rect width="480" height="300" fill="#0a0f1e" rx="12"/>
      {/* 3D background hint */}
      <ellipse cx="300" cy="180" rx="160" ry="100" fill="rgba(167,139,250,0.04)"/>
      {/* Constellation faded in bg */}
      <circle cx="280" cy="160" r="8" fill={PURPLE_BG} stroke={PURPLE} strokeWidth="1" opacity="0.5"/>
      <circle cx="340" cy="130" r="10" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1.5" opacity="0.6"/>
      <circle cx="360" cy="200" r="7" fill="rgba(0,229,255,0.06)" stroke="#00E5FF" strokeWidth="1" opacity="0.4"/>
      <line x1="288" y1="160" x2="330" y2="130" stroke={PURPLE} strokeWidth="1" opacity="0.2"/>
      <line x1="350" y1="130" x2="357" y2="193" stroke="#00E5FF" strokeWidth="1" opacity="0.15"/>
      {/* Active node glow */}
      <circle cx="280" cy="160" r="20" fill={PURPLE_BG} opacity="0.4"/>
      {/* Nav */}
      <rect width="480" height="44" fill="#0F1829"/>
      <text x="240" y="27" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={PURPLE} letterSpacing="3">ARCHITECT · FLOW MODE</text>
      {/* HUD top-left */}
      <rect x="20" y="60" width="120" height="28" rx="4" fill="white"/>
      <text x="80" y="78" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#0a0f1e" fontWeight="700">Next Step →</text>
      <rect x="146" y="60" width="80" height="28" rx="4" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      <text x="186" y="78" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="rgba(255,255,255,0.4)">Stop Flow</text>
      {/* Active node panel */}
      <rect x="20" y="102" width="200" height="112" rx="8" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <text x="34" y="122" fontFamily="monospace" fontSize="7" fill={PURPLE} fontWeight="700" letterSpacing="2">ACTION NODE</text>
      <text x="34" y="140" fontFamily="monospace" fontSize="12" fill="#E8F4F8" fontWeight="900">MORNING RITUAL</text>
      <line x1="34" y1="150" x2="206" y2="150" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
      <text x="34" y="166" fontFamily="monospace" fontSize="7" fill="rgba(255,255,255,0.4)">Awaiting manual</text>
      <text x="34" y="178" fontFamily="monospace" fontSize="7" fill="rgba(255,255,255,0.4)">completion of</text>
      <text x="34" y="190" fontFamily="monospace" fontSize="7" fill="rgba(255,255,255,0.4)">physical action.</text>
    </svg>
  )
}

function TimerMockup() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      <rect width="480" height="300" fill="#0a0f1e" rx="12"/>
      {/* Nav */}
      <rect width="480" height="44" fill="#0F1829"/>
      <text x="240" y="27" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={PURPLE} letterSpacing="3">ARCHITECT · FLOW MODE</text>
      {/* Next step + stop */}
      <rect x="20" y="60" width="120" height="28" rx="4" fill="white"/>
      <text x="80" y="78" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#0a0f1e" fontWeight="700">Next Step →</text>
      <rect x="146" y="60" width="80" height="28" rx="4" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      <text x="186" y="78" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="rgba(255,255,255,0.4)">Stop Flow</text>
      {/* Timer node panel */}
      <rect x="20" y="100" width="210" height="160" rx="8" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <text x="34" y="120" fontFamily="monospace" fontSize="7" fill="#00E5FF" fontWeight="700" letterSpacing="2">TIMER NODE</text>
      <text x="34" y="138" fontFamily="monospace" fontSize="12" fill="#E8F4F8" fontWeight="900">DEEP WORK SESSION</text>
      <line x1="34" y1="148" x2="216" y2="148" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
      {/* Countdown display */}
      <rect x="30" y="156" width="194" height="44" rx="6" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
      <text x="127" y="186" textAnchor="middle" fontFamily="monospace" fontSize="28" fill="#00E5FF" fontWeight="900">24:07</text>
      {/* Start/pause button */}
      <rect x="30" y="208" width="194" height="34" rx="6" fill="rgba(0,229,255,0.15)" stroke="#00E5FF" strokeWidth="1"/>
      <text x="127" y="229" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#00E5FF" fontWeight="700">INITIALIZE COUNTDOWN</text>
      {/* Status */}
      <text x="127" y="254" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="rgba(255,255,255,0.25)" letterSpacing="2">FOCUS MAINTENANCE PAUSED</text>
    </svg>
  )
}

function BranchMockup() {
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl overflow-hidden">
      <rect width="480" height="300" fill="#0a0f1e" rx="12"/>
      {/* Nav */}
      <rect width="480" height="44" fill="#0F1829"/>
      <text x="240" y="27" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={PURPLE} letterSpacing="3">ARCHITECT · FLOW MODE</text>
      {/* Branch selector */}
      <text x="20" y="70" fontFamily="monospace" fontSize="7" fill="rgba(255,255,255,0.3)" letterSpacing="3">SELECT NEXT PATH:</text>
      {/* Branch option 1 */}
      <rect x="20" y="80" width="220" height="44" rx="4" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <text x="34" y="107" fontFamily="monospace" fontSize="9" fill="#E8F4F8">DEEP WORK SESSION</text>
      <text x="222" y="107" textAnchor="end" fontFamily="monospace" fontSize="10" fill="rgba(255,255,255,0.2)">→</text>
      {/* Branch option 2 — highlighted on hover */}
      <rect x="20" y="130" width="220" height="44" rx="4" fill="#00E5FF" stroke="#00E5FF" strokeWidth="1"/>
      <text x="34" y="157" fontFamily="monospace" fontSize="9" fill="#0A0F1E" fontWeight="700">EMERGENCY RECOVERY</text>
      <text x="222" y="157" textAnchor="end" fontFamily="monospace" fontSize="10" fill="#0A0F1E" fontWeight="700">→</text>
      {/* Branch option 3 */}
      <rect x="20" y="180" width="220" height="44" rx="4" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <text x="34" y="207" fontFamily="monospace" fontSize="9" fill="#E8F4F8">FREE FLOW MODE</text>
      <text x="222" y="207" textAnchor="end" fontFamily="monospace" fontSize="10" fill="rgba(255,255,255,0.2)">→</text>
      {/* Info hint */}
      <text x="20" y="244" fontFamily="monospace" fontSize="7" fill="rgba(255,255,255,0.2)">This node has 3 outgoing paths.</text>
      <text x="20" y="258" fontFamily="monospace" fontSize="7" fill="rgba(255,255,255,0.2)">Choose your next momentum direction.</text>
    </svg>
  )
}

const walkthroughSteps = [
  {
    num: '01',
    title: 'Open the Protocol Builder',
    body: 'From the landing page, click the Protocol Builder card in the OS Tools section. You land on /protocol-builder in Build Mode with a sample constellation: Morning Ritual → Deep Work Session → Recovery Walk. These are editable — it is just a starting point.',
    visual: <LandingCardMockup />,
  },
  {
    num: '02',
    title: 'Build Mode — your constellation',
    body: 'You are now in the Architect view. The dark 3D space shows your nodes as floating points connected by lines. The right sidebar is the Node Architect panel. This is where you design — not execute — your protocol.',
    visual: <BuildModeMockup />,
  },
  {
    num: '03',
    title: 'Add and rename nodes',
    body: 'In the sidebar, click the + icon to add an Action node, the ⏱ icon for a Timer node, or the ⬡ icon for a Tool node. Click any node in the list to select it, then edit its Label and Type in the "Edit Properties" section below. Your changes save automatically.',
    visual: <AddNodesMockup />,
  },
  {
    num: '04',
    title: 'Connect nodes into a Momentum Path',
    body: 'With a node selected, scroll to "Momentum Path" in the sidebar. Use the "Connect to..." dropdown to pick the next node, then click +. This creates a directed edge. You can add multiple connections from one node to create a branching path.',
    visual: <ConnectMockup />,
  },
  {
    num: '05',
    title: 'Switch to Flow Mode and execute',
    body: 'When your constellation is built, click "Flow" in the top bar mode switcher. Select your starting node from the list (or click it in the 3D view). The sidebar disappears. The active node panel appears top-left with "Next Step →."',
    visual: <FlowModeMockup />,
  },
  {
    num: '06',
    title: 'Timer nodes run a countdown',
    body: 'When a Timer node is active, the panel shows a large monospace countdown. Tap "Initialize Countdown" to start it. When the timer hits zero, the next node unlocks automatically. You can pause mid-session with "Pause Protocol."',
    visual: <TimerMockup />,
  },
  {
    num: '07',
    title: 'Branching paths — choose your direction',
    body: 'If the current node has multiple outgoing connections, "Next Step →" is replaced by a branch selector. Each option shows as a button. Tap the path that fits your current state. This is how you build adaptive, context-aware protocols.',
    visual: <BranchMockup />,
  },
]

const tips = [
  {
    icon: '🎯',
    title: 'Start with 3 nodes, not 10',
    body: 'The most common mistake is over-engineering the first protocol. Start with Morning Ritual → Deep Work 25 min → Recovery Walk. Run it for a week. Add complexity only when you identify a real gap.',
  },
  {
    icon: '🔥',
    title: 'Use the Ignite button as a protocol warm-up',
    body: 'The "Ignite Momentum" button in the sidebar triggers the 600-second Ignition sequence without leaving the builder. Use it as the pre-protocol activation ritual before switching to Flow Mode on high-resistance days.',
  },
  {
    icon: '⚡',
    title: 'Tool nodes pass context back automatically',
    body: 'When a Tool node (Atomizer) sends you to /atomizer, it passes a returnTo parameter. When you complete the atomization, you are returned directly to the Protocol Builder at the correct node — no manual navigation needed.',
  },
  {
    icon: '🌿',
    title: 'Build branching paths for energy states',
    body: 'Create branches for "High Energy Day" and "Low Energy Day" from a single node. In Flow Mode, choose the path that fits your current state. This makes the protocol adapt to you, not the other way around.',
  },
  {
    icon: '💾',
    title: 'Everything saves automatically',
    body: 'Your constellation and execution state are saved to localStorage. If you close the tab mid-session and return, you will resume exactly where you left off — same active node, same mode.',
  },
  {
    icon: '🔁',
    title: 'Duplicate your base protocol for variants',
    body: 'The protocol saves to localStorage under a single key. If you want a Monday protocol vs a Friday protocol, build Monday\'s first, run it, then rebuild Friday\'s. Future versions may support named protocols.',
  },
]

export default function ProtocolBuilderGuidePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: ET.bg, color: ET.ink }}>

      {/* ── Nav ── */}
      <nav
        className="sticky top-0 z-50 border-b px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: 'rgba(10,15,30,0.92)', borderColor: ET.border, backdropFilter: 'blur(12px)' }}
      >
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/logo.png" alt="Adduckivity" width={36} height={36} className="rounded-lg" />
          <span className="font-semibold text-lg" style={{ color: ET.ink }}>Adduckivity</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/protocol-builder"
            className="text-sm font-medium px-4 py-2 rounded-full transition-all hover:opacity-80"
            style={{ backgroundColor: PURPLE_BG, color: PURPLE, border: `1px solid ${PURPLE_BORDER}` }}
          >
            🏗 Open Protocol Builder →
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6">

        {/* ── Hero ── */}
        <div className="py-16 md:py-20 border-b" style={{ borderColor: ET.border }}>
          <Link
            href="/protocol-builder"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-6 hover:opacity-70 transition-opacity"
            style={{ color: PURPLE }}
          >
            ← Back to Protocol Builder
          </Link>
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: ET.sub }}>
                Duck OS · System Architect · Guide
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4" style={{ color: ET.ink }}>
                How to Use<br />
                <span style={{ color: PURPLE }}>Protocol Builder</span>
              </h1>
              <p className="text-base leading-relaxed mb-6" style={{ color: ET.mid }}>
                Map your daily momentum as a 3D constellation of nodes. Build the sequence once — execute it in Flow Mode with zero decision overhead. The system becomes the structure your brain cannot generate on demand.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: '4 node types', sub: 'action, timer, tool, ignition' },
                  { label: '2 modes', sub: 'build + flow' },
                  { label: 'persistent', sub: 'auto-saved locally' },
                ].map(b => (
                  <div key={b.label} className="px-4 py-2.5 rounded-xl border text-center"
                    style={{ borderColor: ET.border, backgroundColor: ET.surface }}>
                    <div className="text-sm font-bold" style={{ color: PURPLE }}>{b.label}</div>
                    <div className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: ET.sub }}>{b.sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-72 shrink-0">
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: ET.border }}>
                <Image
                  src="/uploads/protocol-builder-cover.svg"
                  alt="Protocol Builder"
                  width={800}
                  height={450}
                  className="w-full"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── What It Solves ── */}
        <section className="py-14 border-b" style={{ borderColor: ET.border }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ET.sub }}>When to Use This</p>
          <h2 className="text-2xl font-bold mb-8" style={{ color: ET.ink }}>What the Protocol Builder solves</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { signal: 'Daily plan collapse', desc: 'You had a plan but could not follow it. Decision fatigue, unexpected inputs, and emotional state changes derailed the sequence. A protocol removes real-time planning from the equation.', color: PURPLE },
              { signal: 'No repeatable system', desc: 'Each day you figure out your workflow from scratch. Productive days happen by accident, not design. The builder lets you reverse-engineer a good day and turn it into a repeatable protocol.', color: PURPLE },
              { signal: 'Tool fragmentation', desc: 'You use Ignition, Atomizer, and Emergency Recovery separately but they are not connected. The builder chains them into a single momentum arc — trigger one node and the whole system flows.', color: '#00E5FF' },
              { signal: 'Overwhelm from planning', desc: 'Trying to plan while depleted makes things worse. A pre-built constellation removes the planning overhead. You open Flow Mode and follow the path — no decisions required.', color: '#00E5FF' },
            ].map(s => (
              <div key={s.signal} className="flex gap-4 p-4 rounded-xl border"
                style={{ backgroundColor: ET.surface, borderColor: ET.border }}>
                <div className="w-2 rounded-full shrink-0 mt-1" style={{ backgroundColor: s.color, minHeight: 40 }} />
                <div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: ET.ink }}>{s.signal}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: ET.sub }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-4 border text-sm leading-relaxed" style={{ backgroundColor: PURPLE_BG, borderColor: PURPLE_BORDER, color: PURPLE }}>
            <strong>Core principle:</strong> The protocol is designed once when your brain is functioning well. It is executed when your brain is not. The gap between "how you are when you plan" and "how you are when you execute" is exactly what the Protocol Builder bridges.
          </div>
        </section>

        {/* ── Core Concepts ── */}
        <section className="py-14 border-b" style={{ borderColor: ET.border }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ET.sub }}>Core Concepts</p>
          <h2 className="text-2xl font-bold mb-8" style={{ color: ET.ink }}>Three things to understand first</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {concepts.map(c => (
              <div key={c.num} className="p-5 rounded-2xl border flex flex-col gap-3"
                style={{ backgroundColor: ET.surface, borderColor: ET.border }}>
                <span className="text-3xl font-bold tabular-nums leading-none" style={{ color: 'rgba(167,139,250,0.35)' }}>{c.num}</span>
                <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: PURPLE }} />
                <h3 className="font-semibold text-sm" style={{ color: ET.ink }}>{c.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: ET.sub }}>{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Node Types ── */}
        <section className="py-14 border-b" style={{ borderColor: ET.border }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ET.sub }}>Node Types</p>
          <h2 className="text-2xl font-bold mb-8" style={{ color: ET.ink }}>The 4 building blocks</h2>
          <div className="flex flex-col gap-5">
            {nodeTypes.map((n, i) => (
              <div key={n.type} className="rounded-2xl border overflow-hidden"
                style={{ backgroundColor: ET.surface, borderColor: ET.border }}>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{n.icon}</span>
                    <span className="font-bold text-lg" style={{ color: ET.ink }}>{n.type}</span>
                    <span className="ml-auto text-xs font-mono px-3 py-1 rounded-full border"
                      style={{ borderColor: n.colorBorder, color: n.color, backgroundColor: n.colorBg }}>
                      {['manual', 'countdown', 'linked', 'ignition'][i]}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: ET.mid }}>{n.description}</p>
                  <div className="rounded-lg p-3 text-xs leading-relaxed"
                    style={{ backgroundColor: PURPLE_BG, color: ET.sub, border: `1px solid ${PURPLE_BORDER}` }}>
                    <span className="font-semibold" style={{ color: PURPLE }}>Example labels: </span>{n.example}
                  </div>
                </div>
                <div className="h-1" style={{ backgroundColor: ET.border }}>
                  <div className="h-full" style={{ width: `${(i + 1) * 25}%`, backgroundColor: n.color, opacity: 0.4 }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Step by Step Walkthrough ── */}
        <section className="py-14 border-b" style={{ borderColor: ET.border }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ET.sub }}>How to Use</p>
          <h2 className="text-2xl font-bold mb-10" style={{ color: ET.ink }}>Step-by-step walkthrough</h2>
          <div className="flex flex-col gap-16">
            {walkthroughSteps.map((step, i) => (
              <div key={step.num}
                className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0"
                      style={{ backgroundColor: PURPLE_BG, color: PURPLE, border: `1px solid ${PURPLE_BORDER}` }}
                    >
                      {step.num}
                    </span>
                    <h3 className="font-bold text-lg" style={{ color: ET.ink }}>{step.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed pl-11" style={{ color: ET.mid }}>{step.body}</p>
                </div>
                <div className="w-full md:w-80 shrink-0">
                  <div className="rounded-2xl border overflow-hidden" style={{ borderColor: ET.border }}>
                    {step.visual}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tips ── */}
        <section className="py-14 border-b" style={{ borderColor: ET.border }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ET.sub }}>Best Practices</p>
          <h2 className="text-2xl font-bold mb-8" style={{ color: ET.ink }}>Tips for building protocols that stick</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {tips.map(tip => (
              <div key={tip.title} className="rounded-xl border p-5 flex gap-4"
                style={{ backgroundColor: ET.surface, borderColor: ET.border }}>
                <span className="text-2xl shrink-0 mt-0.5">{tip.icon}</span>
                <div>
                  <h3 className="font-semibold text-sm mb-1.5" style={{ color: ET.ink }}>{tip.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: ET.sub }}>{tip.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: ET.sub }}>Ready?</p>
          <h2 className="text-3xl font-bold mb-4" style={{ color: ET.ink }}>
            Stop reading.<br />
            <span style={{ color: PURPLE }}>Build your first constellation.</span>
          </h2>
          <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: ET.sub }}>
            Start with 3 nodes. Map one real day. Run it in Flow Mode tomorrow morning.
          </p>
          <Link
            href="/protocol-builder"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${PURPLE}, #7c3aed)`,
              color: 'white',
              boxShadow: `0 0 40px rgba(167,139,250,0.3)`,
            }}
          >
            <span>🏗</span>
            Open Protocol Builder
          </Link>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t py-10 px-6" style={{ borderColor: ET.border, backgroundColor: ET.surface }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Adduckivity" width={28} height={28} className="rounded-md" />
            <span className="font-semibold text-sm" style={{ color: ET.ink }}>Adduckivity</span>
          </div>
          <div className="flex items-center gap-7 text-xs" style={{ color: ET.sub }}>
            <Link href="/" className="hover:opacity-70 transition-opacity">Home</Link>
            <Link href="/blog" className="hover:opacity-70 transition-opacity">Blog</Link>
            <Link href="/protocol-builder" className="hover:opacity-70 transition-opacity">Launch Builder</Link>
            <Link href="/atomizer/guide" className="hover:opacity-70 transition-opacity">Atomizer Guide</Link>
            <Link href="/ignition/guide" className="hover:opacity-70 transition-opacity">Ignition Guide</Link>
          </div>
          <p className="text-xs" style={{ color: ET.sub }}>Powered by Duck OS Systems</p>
        </div>
      </footer>

    </div>
  )
}
