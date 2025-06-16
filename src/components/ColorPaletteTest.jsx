
// 각 팔레트의 정보를 담은 배열
const palettes = [
    {
        name: 'Coastal Morning',
        description: '안개 낀 새벽 해변의 고요하고 차분한 우아함.',
        colors: [
            { name: 'Crème', var: '--kalani-coastal-creme' },
            { name: 'Stone', var: '--kalani-coastal-stone' },
            { name: 'Mist', var: '--kalani-coastal-mist' },
            { name: 'Ash', var: '--kalani-coastal-ash' },
            { name: 'Gold', var: '--kalani-coastal-gold' },
            { name: 'Driftwood', var: '--kalani-coastal-driftwood' },
            { name: 'Taupe', var: '--kalani-coastal-taupe' },
            { name: 'Shell', var: '--kalani-coastal-shell' },
        ],
    },
    {
        name: 'Tuscan Sun',
        description: '이탈리아 토스카나 지방의 따뜻한 햇살과 오래된 건축물.',
        colors: [
            { name: 'Bone', var: '--kalani-tuscan-bone' },
            { name: 'Clay', var: '--kalani-tuscan-clay' },
            { name: 'Olive', var: '--kalani-tuscan-olive' },
            { name: 'Umber', var: '--kalani-tuscan-umber' },
            { name: 'Bronze', var: '--kalani-tuscan-bronze' },
        ],
    },
    {
        name: 'Midnight Velvet',
        description: '벨벳 커튼이 드리워진 고요한 밤의 신비롭고 관능적인 무드.',
        colors: [
            { name: 'Moon', var: '--kalani-velvet-moon' },
            { name: 'Ink', var: '--kalani-velvet-ink' },
            { name: 'Wine', var: '--kalani-velvet-wine' },
            { name: 'Slate', var: '--kalani-velvet-slate' },
            { name: 'Silver', var: '--kalani-velvet-silver' },
        ],
    },
];

// 각 색상 샘플을 보여주는 작은 컴포넌트
const ColorSwatch = ({ name, colorVar }) => (
    <div style={{ fontFamily: 'sans-serif' }}>
        <div style={{
            width: '100px',
            height: '100px',
            backgroundColor: `var(${colorVar})`,
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }} />
        <p style={{ marginTop: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>{name}</p>
        <p style={{ fontSize: '12px', color: '#6B7280', userSelect: 'all' }}>{colorVar}</p>
    </div>
);

// 전체 팔레트를 렌더링하는 메인 테스트 컴포넌트
export default function ColorPaletteTest() {
    return (
        <div style={{ padding: '40px', backgroundColor: '#F9FAFB' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px', color: '#111827' }}>KALANI Brand Color Palette</h1>
            <p style={{ fontSize: '18px', color: '#4B5563', marginBottom: '40px' }}>
                아래는 `palette.css`에 정의된 CSS 변수를 사용하여 렌더링된 색상 견본입니다.
            </p>

            {palettes.map(palette => (
                <div key={palette.name} style={{ marginBottom: '48px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px', marginBottom: '24px' }}>
                        {palette.name}
                    </h2>
                    <p style={{ color: '#6B7280', marginBottom: '24px' }}>{palette.description}</p>
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        {palette.colors.map(color => (
                            <ColorSwatch key={color.var} name={color.name} colorVar={color.var} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}