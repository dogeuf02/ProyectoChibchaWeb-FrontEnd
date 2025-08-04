// src/components/common/SpinningLogo.jsx
export default function SpinningLogo({ size = 64 }) {
  return (
    <img
      src="/logoPestana.png"
      alt="Loading..."
      style={{
        width: size,
        height: size,
        animation: 'spin 2s linear infinite',
      }}
    />
  );
}
