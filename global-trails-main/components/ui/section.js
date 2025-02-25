export default function Section({ children, styles }) {
	return <section className={`p-8 py-32 rounded-t-[4em] bg-gray-white -translate-y-10 ${styles}`}>{children}</section>;
}
